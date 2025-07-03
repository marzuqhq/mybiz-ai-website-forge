
import sdk from './sdk';
import { aiService, AIService } from './ai-service';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  context?: any;
}

interface ChatMemory {
  conversationId: string;
  userId?: string;
  websiteId: string;
  messages: ChatMessage[];
  userProfile: {
    name?: string;
    interests: string[];
    previousQuestions: string[];
    businessContext: any;
  };
  businessContext: {
    name: string;
    industry: string;
    services: string[];
    products: any[];
    faqs: any[];
    blogPosts: any[];
    customers: any[];
  };
  createdAt: Date;
  lastActivity: Date;
}

class AIChatService {
  private memory: Map<string, ChatMemory> = new Map();
  private conversationId: string;
  private aiService: InstanceType<typeof AIService>;

  constructor(websiteId: string, userId?: string) {
    this.conversationId = `${websiteId}-${userId || 'anonymous'}-${Date.now()}`;
    this.aiService = aiService;
  }

  async initializeChat(websiteId: string, userId?: string): Promise<ChatMemory> {
    try {
      console.log('Initializing AI chat for website:', websiteId);
      
      // Load comprehensive business context
      const [website, products, faqs, blogPosts, customers] = await Promise.all([
        sdk.get('websites').then(sites => sites.find(s => s.id === websiteId)),
        sdk.get('products').then(products => products.filter(p => p.websiteId === websiteId)),
        sdk.get('faqs').then(faqs => faqs.filter(f => f.websiteId === websiteId)),
        sdk.get('blog_posts').then(posts => posts.filter(p => p.websiteId === websiteId)),
        sdk.get('customers').then(customers => customers.filter(c => c.websiteId === websiteId))
      ]);

      // Load previous conversations for memory
      const conversations = await sdk.get('chat_conversations').catch(() => []);
      const userConversations = conversations.filter(c => 
        c.websiteId === websiteId && (userId ? c.userId === userId : true)
      );

      const businessContext = {
        name: website?.name || 'Our Business',
        industry: website?.businessInfo?.industry || 'business',
        services: website?.businessInfo?.services || [],
        products: products || [],
        faqs: faqs || [],
        blogPosts: blogPosts || [],
        customers: customers || []
      };

      // Build comprehensive user profile
      const userProfile = this.buildUserProfile(userConversations);

      const memory: ChatMemory = {
        conversationId: this.conversationId,
        userId,
        websiteId,
        messages: [],
        userProfile,
        businessContext,
        createdAt: new Date(),
        lastActivity: new Date()
      };

      this.memory.set(this.conversationId, memory);
      console.log('AI chat initialized with context:', businessContext);
      
      return memory;
    } catch (error) {
      console.error('Failed to initialize AI chat:', error);
      throw error;
    }
  }

  private buildUserProfile(conversations: any[]): ChatMemory['userProfile'] {
    const interests: string[] = [];
    const previousQuestions: string[] = [];
    let businessContext = {};

    conversations.forEach(conv => {
      if (conv.messages && Array.isArray(conv.messages)) {
        conv.messages.forEach((msg: any) => {
          if (msg.sender === 'user' && msg.content) {
            previousQuestions.push(msg.content);
            this.extractInterests(msg.content, interests);
          }
        });
      }
      if (conv.context) {
        businessContext = { ...businessContext, ...conv.context };
      }
    });

    return {
      interests: [...new Set(interests)],
      previousQuestions: [...new Set(previousQuestions)].slice(-50), // Keep last 50 questions
      businessContext
    };
  }

  private extractInterests(message: string, interests: string[]): void {
    const keywords = [
      'pricing', 'cost', 'price', 'payment', 'buy', 'purchase', 'order',
      'product', 'service', 'feature', 'benefit', 'comparison',
      'support', 'help', 'issue', 'problem', 'question', 'assistance',
      'demo', 'trial', 'free', 'plan', 'subscription', 'upgrade',
      'business', 'company', 'enterprise', 'solution', 'consultation',
      'technical', 'integration', 'api', 'development', 'custom',
      'contact', 'email', 'phone', 'meeting', 'appointment',
      'blog', 'article', 'news', 'update', 'guide', 'tutorial'
    ];

    const lowerMessage = message.toLowerCase();
    keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword) && !interests.includes(keyword)) {
        interests.push(keyword);
      }
    });
  }

  async generateResponse(userMessage: string, conversationId: string): Promise<string> {
    const memory = this.memory.get(conversationId);
    if (!memory) {
      throw new Error('Conversation not found');
    }

    try {
      console.log('Generating AI response for:', userMessage);
      
      // Update conversation memory
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        content: userMessage,
        sender: 'user',
        timestamp: new Date()
      };
      memory.messages.push(userMsg);

      // Build comprehensive context for AI
      const aiContext = {
        businessName: memory.businessContext.name,
        industry: memory.businessContext.industry,
        services: memory.businessContext.services,
        products: memory.businessContext.products,
        faqs: memory.businessContext.faqs,
        blogPosts: memory.businessContext.blogPosts,
        customers: memory.businessContext.customers,
        userInterests: memory.userProfile.interests,
        previousQuestions: memory.userProfile.previousQuestions.slice(-10),
        conversationHistory: memory.messages.slice(-10)
      };

      // Generate intelligent response using AI service
      const response = await this.aiService.generateResponse(
        userMessage,
        aiContext,
        conversationId
      );

      // Update memory with AI response
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      memory.messages.push(botMsg);

      // Update user profile with new interests
      this.extractInterests(userMessage, memory.userProfile.interests);
      memory.userProfile.previousQuestions.push(userMessage);
      memory.lastActivity = new Date();

      // Save conversation to database
      await this.saveConversation(memory);

      console.log('AI response generated successfully');
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Our team is working to resolve this issue. In the meantime, you can try rephrasing your question or contact our support team directly for immediate assistance.";
    }
  }

  private async saveConversation(memory: ChatMemory): Promise<void> {
    try {
      const conversations = await sdk.get('chat_conversations').catch(() => []);
      const existingConv = conversations.find(c => c.id === memory.conversationId);

      const conversationData = {
        websiteId: memory.websiteId,
        userId: memory.userId,
        sessionId: memory.conversationId,
        messages: memory.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp.toISOString(),
          context: msg.context || {}
        })),
        context: {
          userProfile: memory.userProfile,
          businessContext: memory.businessContext
        },
        status: 'active',
        metadata: {
          messageCount: memory.messages.length,
          lastActivity: memory.lastActivity.toISOString(),
          userInterests: memory.userProfile.interests,
          conversationDuration: memory.lastActivity.getTime() - memory.createdAt.getTime()
        }
      };

      if (existingConv) {
        await sdk.update('chat_conversations', memory.conversationId, conversationData);
      } else {
        await sdk.insert('chat_conversations', { 
          ...conversationData, 
          id: memory.conversationId,
          createdAt: memory.createdAt.toISOString()
        });
      }

      console.log('Conversation saved successfully');
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  getMemory(conversationId: string): ChatMemory | undefined {
    return this.memory.get(conversationId);
  }

  clearMemory(conversationId: string): void {
    this.memory.delete(conversationId);
    this.aiService.clearConversation(conversationId);
  }

  // Analytics and insights
  async getConversationAnalytics(websiteId: string): Promise<any> {
    try {
      const conversations = await sdk.get('chat_conversations');
      const websiteConversations = conversations.filter(c => c.websiteId === websiteId);

      const analytics = {
        totalConversations: websiteConversations.length,
        totalMessages: websiteConversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0),
        averageMessagesPerConversation: websiteConversations.length > 0 
          ? websiteConversations.reduce((sum, conv) => sum + (conv.messages?.length || 0), 0) / websiteConversations.length 
          : 0,
        commonTopics: this.extractCommonTopics(websiteConversations),
        userSatisfaction: this.calculateSatisfactionScore(websiteConversations),
        responseTime: this.calculateAverageResponseTime(websiteConversations),
        activeUsers: new Set(websiteConversations.map(c => c.userId).filter(Boolean)).size
      };

      return analytics;
    } catch (error) {
      console.error('Error generating conversation analytics:', error);
      return null;
    }
  }

  private extractCommonTopics(conversations: any[]): string[] {
    const topicCounts: Record<string, number> = {};
    
    conversations.forEach(conv => {
      if (conv.metadata?.userInterests) {
        conv.metadata.userInterests.forEach((interest: string) => {
          topicCounts[interest] = (topicCounts[interest] || 0) + 1;
        });
      }
    });

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic]) => topic);
  }

  private calculateSatisfactionScore(conversations: any[]): number {
    // Simple satisfaction calculation based on conversation length and completion
    const completedConversations = conversations.filter(conv => 
      conv.messages && conv.messages.length > 2
    );
    
    return completedConversations.length / Math.max(conversations.length, 1) * 100;
  }

  private calculateAverageResponseTime(conversations: any[]): number {
    // Simulated response time calculation
    return 1200; // 1.2 seconds average
  }
}

export default AIChatService;
export type { ChatMessage, ChatMemory };
