
import sdk from './sdk';

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
  };
}

class AIChatService {
  private memory: Map<string, ChatMemory> = new Map();
  private conversationId: string;

  constructor(websiteId: string, userId?: string) {
    this.conversationId = `${websiteId}-${userId || 'anonymous'}-${Date.now()}`;
  }

  async initializeChat(websiteId: string, userId?: string): Promise<ChatMemory> {
    try {
      // Load business context
      const [website, products, faqs, blogPosts] = await Promise.all([
        sdk.get('websites').then(sites => sites.find(s => s.id === websiteId)),
        sdk.get('products').then(products => products.filter(p => p.websiteId === websiteId)),
        sdk.get('faqs').then(faqs => faqs.filter(f => f.websiteId === websiteId)),
        sdk.get('blog_posts').then(posts => posts.filter(p => p.websiteId === websiteId))
      ]);

      // Load previous conversations for memory
      const conversations = await sdk.get('chat_conversations');
      const userConversations = conversations.filter(c => 
        c.websiteId === websiteId && (userId ? c.userId === userId : true)
      );

      const businessContext = {
        name: website?.name || 'Our Business',
        industry: website?.businessInfo?.industry || 'business',
        services: website?.businessInfo?.services || [],
        products: products || [],
        faqs: faqs || [],
        blogPosts: blogPosts || []
      };

      // Build user profile from previous conversations
      const userProfile = this.buildUserProfile(userConversations);

      const memory: ChatMemory = {
        conversationId: this.conversationId,
        userId,
        websiteId,
        messages: [],
        userProfile,
        businessContext
      };

      this.memory.set(this.conversationId, memory);
      return memory;
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      throw error;
    }
  }

  private buildUserProfile(conversations: any[]): ChatMemory['userProfile'] {
    const interests: string[] = [];
    const previousQuestions: string[] = [];
    let businessContext = {};

    conversations.forEach(conv => {
      if (conv.messages) {
        conv.messages.forEach((msg: any) => {
          if (msg.sender === 'user') {
            previousQuestions.push(msg.content);
            // Extract interests from user messages
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
      previousQuestions: [...new Set(previousQuestions)].slice(-20), // Keep last 20 questions
      businessContext
    };
  }

  private extractInterests(message: string, interests: string[]): void {
    const keywords = [
      'price', 'cost', 'pricing', 'payment', 'buy', 'purchase', 'order',
      'product', 'service', 'feature', 'benefit', 'comparison',
      'support', 'help', 'issue', 'problem', 'question',
      'demo', 'trial', 'free', 'plan', 'subscription',
      'business', 'company', 'enterprise', 'solution',
      'technical', 'integration', 'api', 'development'
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
      // Update user message in memory
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        content: userMessage,
        sender: 'user',
        timestamp: new Date()
      };
      memory.messages.push(userMsg);

      // Generate intelligent response based on context and memory
      const response = await this.generateIntelligentResponse(userMessage, memory);

      // Update bot response in memory
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

      // Save conversation to database
      await this.saveConversation(memory);

      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Could you please try rephrasing your question?";
    }
  }

  private async generateIntelligentResponse(userMessage: string, memory: ChatMemory): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();
    const { businessContext, userProfile } = memory;

    // Greeting responses
    if (this.isGreeting(lowerMessage)) {
      const welcomeResponse = this.generateWelcomeResponse(businessContext, userProfile);
      return welcomeResponse;
    }

    // Product inquiries
    if (this.isProductInquiry(lowerMessage)) {
      return this.generateProductResponse(lowerMessage, businessContext);
    }

    // Pricing inquiries
    if (this.isPricingInquiry(lowerMessage)) {
      return this.generatePricingResponse(businessContext);
    }

    // FAQ matching
    const faqMatch = this.findFAQMatch(lowerMessage, businessContext.faqs);
    if (faqMatch) {
      return this.generateFAQResponse(faqMatch);
    }

    // Blog content suggestions
    if (this.isContentInquiry(lowerMessage)) {
      return this.generateContentResponse(lowerMessage, businessContext);
    }

    // Support inquiries
    if (this.isSupportInquiry(lowerMessage)) {
      return this.generateSupportResponse(businessContext);
    }

    // Contact information
    if (this.isContactInquiry(lowerMessage)) {
      return this.generateContactResponse(businessContext);
    }

    // Personalized response based on history
    if (userProfile.previousQuestions.length > 0) {
      return this.generatePersonalizedResponse(userMessage, memory);
    }

    // Default intelligent response
    return this.generateDefaultResponse(userMessage, businessContext);
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isProductInquiry(message: string): boolean {
    const productKeywords = ['product', 'service', 'what do you', 'what can you', 'features', 'offer'];
    return productKeywords.some(keyword => message.includes(keyword));
  }

  private isPricingInquiry(message: string): boolean {
    const pricingKeywords = ['price', 'cost', 'pricing', 'how much', 'expensive', 'cheap', 'affordable'];
    return pricingKeywords.some(keyword => message.includes(keyword));
  }

  private isContentInquiry(message: string): boolean {
    const contentKeywords = ['blog', 'article', 'read', 'learn', 'information', 'guide', 'tutorial'];
    return contentKeywords.some(keyword => message.includes(keyword));
  }

  private isSupportInquiry(message: string): boolean {
    const supportKeywords = ['help', 'support', 'problem', 'issue', 'trouble', 'error', 'bug'];
    return supportKeywords.some(keyword => message.includes(keyword));
  }

  private isContactInquiry(message: string): boolean {
    const contactKeywords = ['contact', 'reach', 'phone', 'email', 'address', 'location'];
    return contactKeywords.some(keyword => message.includes(keyword));
  }

  private generateWelcomeResponse(businessContext: any, userProfile: any): string {
    let response = `👋 Welcome to ${businessContext.name}! `;
    
    if (userProfile.previousQuestions.length > 0) {
      response += "Great to see you back! ";
    }

    response += `I'm your AI assistant and I'm here to help you with:\n\n`;

    if (businessContext.products.length > 0) {
      response += `🛍️ **Our Products & Services** - We offer ${businessContext.products.length} products\n`;
    }
    
    if (businessContext.faqs.length > 0) {
      response += `❓ **Frequently Asked Questions** - Quick answers to common questions\n`;
    }
    
    if (businessContext.blogPosts.length > 0) {
      response += `📚 **Latest Insights** - Check out our ${businessContext.blogPosts.length} blog posts\n`;
    }

    response += `💬 **General Support** - Any questions about our business\n\n`;

    if (userProfile.interests.length > 0) {
      response += `Based on our previous conversations, I noticed you're interested in: ${userProfile.interests.slice(0, 3).join(', ')}. `;
    }

    response += `How can I assist you today?`;

    return response;
  }

  private generateProductResponse(message: string, businessContext: any): string {
    if (businessContext.products.length === 0) {
      return `We're currently setting up our product catalog. Please check back soon or contact us directly for information about our ${businessContext.industry} services.`;
    }

    let response = `🛍️ **Our Products & Services:**\n\n`;
    
    businessContext.products.slice(0, 3).forEach((product: any, index: number) => {
      response += `**${index + 1}. ${product.name}**\n`;
      response += `${product.description || 'Premium quality product'}\n`;
      if (product.price) {
        response += `💰 Price: $${product.price}\n`;
      }
      response += `\n`;
    });

    if (businessContext.products.length > 3) {
      response += `*...and ${businessContext.products.length - 3} more products available*\n\n`;
    }

    response += `Would you like more details about any specific product, or do you have questions about pricing and availability?`;

    return response;
  }

  private generatePricingResponse(businessContext: any): string {
    let response = `💰 **Pricing Information for ${businessContext.name}:**\n\n`;

    if (businessContext.products.length > 0) {
      const productsWithPrices = businessContext.products.filter((p: any) => p.price);
      
      if (productsWithPrices.length > 0) {
        response += `Here are our current product prices:\n\n`;
        productsWithPrices.slice(0, 5).forEach((product: any) => {
          response += `• **${product.name}**: $${product.price}\n`;
        });
        response += `\n`;
      }
    }

    response += `📞 **Get Custom Pricing:**\n`;
    response += `• Contact our sales team for bulk discounts\n`;
    response += `• Enterprise pricing available\n`;
    response += `• Flexible payment options\n\n`;

    response += `Would you like a detailed quote for any specific products or services?`;

    return response;
  }

  private findFAQMatch(message: string, faqs: any[]): any {
    return faqs.find(faq => 
      message.includes(faq.question.toLowerCase().substring(0, 10)) ||
      faq.question.toLowerCase().includes(message.substring(0, 10))
    );
  }

  private generateFAQResponse(faq: any): string {
    return `❓ **${faq.question}**\n\n${faq.answer}\n\nWas this helpful? Feel free to ask if you need more information!`;
  }

  private generateContentResponse(message: string, businessContext: any): string {
    if (businessContext.blogPosts.length === 0) {
      return `📚 We're working on creating valuable content for you. Please check back soon for insights about ${businessContext.industry} and our services.`;
    }

    let response = `📚 **Recommended Reading:**\n\n`;
    
    businessContext.blogPosts.slice(0, 3).forEach((post: any, index: number) => {
      response += `**${index + 1}. ${post.title}**\n`;
      response += `${post.excerpt || post.content.substring(0, 100) + '...'}\n`;
      response += `📅 Published: ${new Date(post.createdAt).toLocaleDateString()}\n\n`;
    });

    response += `Would you like me to tell you more about any of these articles?`;

    return response;
  }

  private generateSupportResponse(businessContext: any): string {
    return `🛠️ **Support & Help**\n\n` +
           `I'm here to help you with any questions or issues you might have about ${businessContext.name}.\n\n` +
           `**Common Support Topics:**\n` +
           `• Product information and usage\n` +
           `• Account and billing questions\n` +
           `• Technical troubleshooting\n` +
           `• General business inquiries\n\n` +
           `Please describe your specific issue or question, and I'll do my best to help you find a solution!`;
  }

  private generateContactResponse(businessContext: any): string {
    return `📞 **Contact ${businessContext.name}:**\n\n` +
           `**Get in Touch:**\n` +
           `• 📧 Email: hello@${businessContext.name.toLowerCase().replace(/\s+/g, '')}.com\n` +
           `• 📱 Phone: +1 (555) 123-4567\n` +
           `• 🕒 Business Hours: Monday-Friday, 9AM-6PM EST\n` +
           `• 💬 Live Chat: Available right here!\n\n` +
           `**Social Media:**\n` +
           `• Follow us for updates and news\n` +
           `• Connect with our community\n\n` +
           `Is there anything specific you'd like to discuss or any way I can connect you with our team?`;
  }

  private generatePersonalizedResponse(message: string, memory: ChatMemory): string {
    const recentTopics = memory.userProfile.interests.slice(-3);
    const contextualResponse = `Based on our previous conversations about ${recentTopics.join(', ')}, `;
    
    return contextualResponse + this.generateDefaultResponse(message, memory.businessContext);
  }

  private generateDefaultResponse(message: string, businessContext: any): string {
    const responses = [
      `That's a great question about ${businessContext.name}. Let me help you find the information you need.`,
      `I understand you're asking about ${message.split(' ').slice(0, 3).join(' ')}. Here's what I can tell you:`,
      `Thanks for reaching out! I'd be happy to help you with that inquiry.`
    ];

    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return baseResponse + `\n\n` +
           `For the most accurate and detailed information, I recommend:\n` +
           `• Browsing our product catalog\n` +
           `• Checking our FAQ section\n` +
           `• Contacting our expert team directly\n\n` +
           `Is there anything specific I can help clarify for you?`;
  }

  private async saveConversation(memory: ChatMemory): Promise<void> {
    try {
      const conversations = await sdk.get('chat_conversations');
      const existingConv = conversations.find(c => c.id === memory.conversationId);

      const conversationData = {
        websiteId: memory.websiteId,
        userId: memory.userId,
        sessionId: memory.conversationId,
        messages: memory.messages,
        context: {
          userProfile: memory.userProfile,
          businessContext: memory.businessContext
        },
        status: 'active',
        metadata: {
          messageCount: memory.messages.length,
          lastActivity: new Date().toISOString()
        }
      };

      if (existingConv) {
        await sdk.update('chat_conversations', memory.conversationId, conversationData);
      } else {
        await sdk.insert('chat_conversations', { ...conversationData, id: memory.conversationId });
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  getMemory(conversationId: string): ChatMemory | undefined {
    return this.memory.get(conversationId);
  }

  clearMemory(conversationId: string): void {
    this.memory.delete(conversationId);
  }
}

export default AIChatService;
export type { ChatMessage, ChatMemory };
