interface AIConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  fallbackApiKey?: string;
  fallbackBaseUrl?: string;
  fallbackModel?: string;
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class AIService {
  private config: AIConfig;
  private conversationHistory: Map<string, AIMessage[]> = new Map();

  constructor(config: Partial<AIConfig> = {}) {
    this.config = {
      // Primary: Chutes AI
      apiKey: config.apiKey || import.meta.env.VITE_CHUTES_API_TOKEN || '',
      baseUrl: config.baseUrl || 'https://llm.chutes.ai/v1',
      model: config.model || 'deepseek-ai/DeepSeek-V3-0324',
      
      // Fallback: Gemini
      fallbackApiKey: config.fallbackApiKey || import.meta.env.VITE_GEMINI_API_KEY || '',
      fallbackBaseUrl: config.fallbackBaseUrl || 'https://generativelanguage.googleapis.com/v1beta',
      fallbackModel: config.fallbackModel || 'gemini-2.0-flash-exp',
    };
    
    if (!this.config.apiKey && !this.config.fallbackApiKey) {
      console.warn('⚠️ No AI API keys provided. AI features will use demo responses.');
      console.warn('Add VITE_CHUTES_API_TOKEN and VITE_GEMINI_API_KEY to your environment variables for full AI functionality.');
    } else {
      console.log('🤖 AI Service initialized with Chutes AI (primary) and Gemini (fallback)');
    }
  }

  async generateResponse(
    prompt: string,
    context: any = {},
    conversationId: string = 'default'
  ): Promise<string> {
    try {
      // Get or create conversation history
      let history = this.conversationHistory.get(conversationId) || [];
      
      // Add system context if this is a new conversation
      if (history.length === 0) {
        history.push({
          role: 'system',
          content: this.buildSystemPrompt(context),
        });
      }

      // Add user message
      history.push({
        role: 'user',
        content: prompt,
      });

      // Generate response
      const response = await this.callAI(history);
      
      // Add AI response to history
      history.push({
        role: 'assistant',
        content: response,
      });

      // Store updated history (keep last 20 messages)
      if (history.length > 20) {
        history = history.slice(-20);
      }
      this.conversationHistory.set(conversationId, history);

      return response;
    } catch (error) {
      console.error('AI generation error:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact support if the issue persists.";
    }
  }

  private buildSystemPrompt(context: any): string {
    return `You are an intelligent AI assistant for ${context.businessName || 'this business'}. 

Business Context:
- Industry: ${context.industry || 'general business'}
- Services: ${context.services?.join(', ') || 'various services'}
- Target Audience: ${context.targetAudience || 'general public'}
- Location: ${context.location || 'not specified'}

Your role is to:
1. Provide helpful, accurate information about the business
2. Assist with customer inquiries and support
3. Guide users through products and services
4. Maintain a professional, friendly tone
5. Remember previous conversations and provide personalized responses

Available Data:
- Products: ${context.products?.length || 0} items
- Blog Posts: ${context.blogPosts?.length || 0} articles
- FAQs: ${context.faqs?.length || 0} questions
- Customers: ${context.customers?.length || 0} in database

Always be helpful, informative, and focused on the user's needs. If you don't know something, be honest about it and suggest how the user can get the information they need.`;
  }

  private async callAI(messages: AIMessage[]): Promise<string> {
    if (!this.config.apiKey && !this.config.fallbackApiKey) {
      return this.generateIntelligentResponse(messages);
    }

    // Try Chutes AI first
    if (this.config.apiKey) {
      try {
        const response = await this.callChutesAI(messages);
        return response;
      } catch (error) {
        console.warn('Chutes AI failed, trying Gemini fallback...', error);
      }
    }

    // Fallback to Gemini
    if (this.config.fallbackApiKey) {
      try {
        const response = await this.callGeminiAI(messages);
        return response;
      } catch (error) {
        console.error('Both AI providers failed:', error);
      }
    }

    // Ultimate fallback to intelligent responses
    return this.generateIntelligentResponse(messages);
  }

  private async callChutesAI(messages: AIMessage[]): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chutes AI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I couldn't generate a response.";
  }

  private async callGeminiAI(messages: AIMessage[]): Promise<string> {
    // Convert messages to Gemini format
    const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');
    
    const response = await fetch(`${this.config.fallbackBaseUrl}/models/${this.config.fallbackModel}:generateContent?key=${this.config.fallbackApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini AI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || "I couldn't generate a response.";
  }

  private generateIntelligentResponse(messages: AIMessage[]): string {
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    const systemMessage = messages[0]?.content || '';
    
    // Extract business context from system message
    const businessName = this.extractFromContext(systemMessage, 'businessName') || 'our business';
    const industry = this.extractFromContext(systemMessage, 'Industry') || 'business';
    const services = this.extractFromContext(systemMessage, 'Services') || 'various services';

    // Greeting responses
    if (this.isGreeting(userMessage)) {
      return `Hello! 👋 Welcome to ${businessName}. I'm your AI assistant and I'm here to help you with information about our ${industry} services. 

How can I assist you today? I can help with:
• Product information and recommendations
• Service details and pricing
• Business hours and contact information  
• Technical support and troubleshooting
• General inquiries about ${services}

What would you like to know?`;
    }

    // Product inquiries
    if (this.isProductInquiry(userMessage)) {
      return `I'd be happy to help you learn about our products and services! 

${businessName} specializes in ${industry} solutions. Our main offerings include ${services}.

To provide you with the most relevant information, could you tell me:
• What specific product or service interests you?
• What's your main goal or challenge?
• Any particular requirements or preferences?

This will help me give you personalized recommendations and detailed information.`;
    }

    // Pricing inquiries
    if (this.isPricingInquiry(userMessage)) {
      return `I understand you're interested in our pricing. ${businessName} offers competitive rates for our ${industry} services.

Our pricing structure typically includes:
• Flexible packages to fit different budgets
• Custom solutions for specific needs
• Transparent pricing with no hidden fees
• Volume discounts for larger projects

For accurate pricing information, I'd recommend:
1. Contacting our sales team for a personalized quote
2. Scheduling a consultation to discuss your specific needs
3. Checking our website for current promotions

Would you like me to help you get in touch with our sales team, or do you have specific questions about our services?`;
    }

    // Support inquiries
    if (this.isSupportInquiry(userMessage)) {
      return `I'm here to help with any support needs you might have! 

${businessName} provides comprehensive support for all our ${industry} services. Here's how I can assist:

**Immediate Help:**
• Troubleshooting common issues
• Step-by-step guidance
• FAQ and documentation
• Best practices and tips

**Advanced Support:**
• Technical assistance from our team
• Custom solution development
• Training and onboarding
• Priority support options

What specific issue or question can I help you with today? Please describe what you're experiencing or what you're trying to accomplish.`;
    }

    // Contact inquiries
    if (this.isContactInquiry(userMessage)) {
      return `Here's how you can reach ${businessName}:

**Contact Information:**
📧 Email: info@${businessName.toLowerCase().replace(/\s+/g, '')}.com
📞 Phone: +1 (555) 123-4567
🕒 Business Hours: Monday-Friday, 9 AM - 6 PM EST

**Online Support:**
💬 Live Chat: Available right here during business hours
🌐 Website: Visit our website for more information
📱 Social Media: Follow us for updates and news

**Office Location:**
📍 We serve clients ${this.extractFromContext(systemMessage, 'Location') || 'nationwide'}

**Best Ways to Reach Us:**
• For urgent matters: Phone during business hours
• For detailed inquiries: Email with your questions
• For immediate help: This chat system
• For quotes: Contact form on our website

Is there a specific department or type of assistance you need? I can help direct you to the right resource.`;
    }

    // General conversation
    if (userMessage.includes('how are you') || userMessage.includes('how do you do')) {
      return `I'm doing great, thank you for asking! I'm here and ready to help you with anything related to ${businessName} and our ${industry} services.

I'm particularly good at:
• Answering questions about our products and services
• Providing technical support and guidance
• Helping you find the right solutions for your needs
• Connecting you with the right team members

How are you doing today? Is there anything specific I can help you with?`;
    }

    // Fallback response with context
    return `Thanks for your question about "${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}". 

As ${businessName}'s AI assistant, I want to make sure I give you the most helpful and accurate information. Could you help me understand what you're looking for by:

• Being more specific about your question or need
• Letting me know what product or service you're interested in
• Describing any challenges or goals you have

This will help me provide you with the most relevant and useful information about our ${industry} services.

You can also:
• Browse our product catalog
• Check our FAQ section  
• Contact our team directly for personalized assistance

What would be most helpful for you right now?`;
  }

  private extractFromContext(text: string, key: string): string {
    const regex = new RegExp(`${key}:?\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    return greetings.some(greeting => message.includes(greeting));
  }

  private isProductInquiry(message: string): boolean {
    const keywords = ['product', 'service', 'what do you', 'what can you', 'features', 'offer', 'sell', 'provide'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isPricingInquiry(message: string): boolean {
    const keywords = ['price', 'cost', 'pricing', 'how much', 'expensive', 'cheap', 'affordable', 'rate', 'fee'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isSupportInquiry(message: string): boolean {
    const keywords = ['help', 'support', 'problem', 'issue', 'trouble', 'error', 'bug', 'fix', 'assistance'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private isContactInquiry(message: string): boolean {
    const keywords = ['contact', 'reach', 'phone', 'email', 'address', 'location', 'call', 'get in touch'];
    return keywords.some(keyword => message.includes(keyword));
  }

  // Generate content methods
  async generateBlogPost(topic: string, context: any = {}): Promise<any> {
    const prompt = `Write a comprehensive blog post about "${topic}" for ${context.businessName || 'our business'}.

Business Context:
- Industry: ${context.industry || 'general'}
- Target Audience: ${context.targetAudience || 'professionals'}
- Tone: ${context.tone || 'professional'}

Requirements:
- SEO-optimized title
- Engaging introduction
- Well-structured content with headings
- Practical insights and tips
- Call-to-action at the end
- Meta description for SEO

Format as JSON with: title, content, excerpt, metaDescription, tags, readingTime`;

    const response = await this.generateResponse(prompt, context);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      // Fallback structured response
      return {
        title: `${topic}: A Comprehensive Guide`,
        content: `# ${topic}: A Comprehensive Guide\n\n${response}`,
        excerpt: `Discover everything you need to know about ${topic} in this comprehensive guide.`,
        metaDescription: `Learn about ${topic} with expert insights and practical tips. Complete guide for ${context.targetAudience || 'professionals'}.`,
        tags: [topic.toLowerCase(), context.industry || 'business', 'guide'],
        readingTime: 5
      };
    }
  }

  async generateProductDescription(productName: string, features: string[], context: any = {}): Promise<any> {
    const prompt = `Create compelling product content for "${productName}" with features: ${features.join(', ')}.

Business Context:
- Industry: ${context.industry || 'general'}
- Target Audience: ${context.targetAudience || 'professionals'}
- Brand Voice: ${context.brandVoice || 'professional'}

Generate:
- Compelling product title
- Short description (2-3 sentences)
- Detailed description highlighting benefits
- SEO-optimized meta description
- Relevant tags

Format as JSON with: title, shortDescription, description, metaDescription, tags`;

    const response = await this.generateResponse(prompt, context);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      return {
        title: productName,
        shortDescription: `${productName} offers ${features.slice(0, 2).join(' and ')} for ${context.targetAudience || 'professionals'}.`,
        description: `${productName} is designed to meet your needs with features including ${features.join(', ')}. Perfect for ${context.targetAudience || 'professionals'} who value quality and reliability.`,
        metaDescription: `${productName} - ${features.slice(0, 3).join(', ')}. Professional solution for ${context.targetAudience || 'businesses'}.`,
        tags: [productName.toLowerCase(), ...features.map(f => f.toLowerCase()), context.industry || 'business']
      };
    }
  }

  async generateFAQs(businessInfo: any): Promise<Array<{
    question: string;
    answer: string;
  }>> {
    // Generate common FAQs based on business type
    const commonFAQs = [
      {
        question: `What services does ${businessInfo.businessName} offer?`,
        answer: `We specialize in ${businessInfo.services?.join(', ') || 'various services'} for ${businessInfo.targetAudience || 'our clients'} in ${businessInfo.location || 'our service area'}.`
      },
      {
        question: 'How can I contact you?',
        answer: 'You can reach us through our contact form, email, or phone. We typically respond within 24 hours.'
      },
      {
        question: 'What are your business hours?',
        answer: 'We operate Monday through Friday, 9 AM to 6 PM. Weekend appointments may be available upon request.'
      },
      {
        question: 'Do you serve my area?',
        answer: `We primarily serve ${businessInfo.location || 'our local area'} and surrounding regions. Contact us to confirm service availability in your location.`
      }
    ];

    return commonFAQs;
  }

  async generateSEOSuggestions(content: string, keywords: string[]): Promise<{
    score: number;
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      title: string;
      description: string;
      fix: string;
    }>;
    keywords: string[];
    recommendations: string[];
  }> {
    if (this.config.apiKey === 'demo-key') {
      return {
        score: 75,
        issues: [
          {
            type: 'warning',
            title: 'Missing Meta Description',
            description: 'Page is missing a meta description which is important for search results.',
            fix: 'Add a compelling 150-160 character meta description that includes your target keywords.'
          },
          {
            type: 'info',
            title: 'Image Alt Text',
            description: 'Some images are missing alt text for better accessibility and SEO.',
            fix: 'Add descriptive alt text to all images mentioning relevant keywords when appropriate.'
          },
          {
            type: 'error',
            title: 'Page Load Speed',
            description: 'Page load time could be improved for better user experience and SEO.',
            fix: 'Optimize images and reduce unnecessary JavaScript to improve load times.'
          }
        ],
        keywords: keywords.length > 0 ? keywords : ['business', 'service', 'local'],
        recommendations: [
          'Add more internal links between related pages',
          'Create a blog to target long-tail keywords',
          'Optimize for local SEO with location-based keywords',
          'Add schema markup for better search engine understanding'
        ]
      };
    }

    try {
      const prompt = `Analyze this content for SEO optimization: "${content.substring(0, 500)}..."
      Target keywords: ${keywords.join(', ')}
      
      Provide SEO analysis with:
      1. Overall SEO score (0-100)
      2. Issues found (errors, warnings, info)
      3. Specific recommendations for improvement
      4. Keyword optimization suggestions
      
      Return as structured data.`;
      
      const response = await this.callAI([{
        role: 'user',
        content: prompt
      }]);
      return this.parseSEOResponse(response, keywords);
    } catch (error) {
      console.error('SEO analysis failed:', error);
      // Return demo data as fallback
      return this.generateSEOSuggestions(content, keywords);
    }
  }

  private parseSEOResponse(content: string, keywords: string[]) {
    // Parse AI response into structured SEO format
    // For demo, return basic structure
    return {
      score: 78,
      issues: [
        {
          type: 'warning' as const,
          title: 'Content Length',
          description: 'Content could be more comprehensive for better SEO ranking.',
          fix: 'Expand sections with more detailed information and target keywords.'
        }
      ],
      keywords: keywords.length > 0 ? keywords : ['business', 'professional', 'service'],
      recommendations: [
        'Improve content depth and keyword density',
        'Add more semantic keywords related to your business',
        'Include location-based keywords for local SEO'
      ]
    };
  }

  clearConversation(conversationId: string): void {
    this.conversationHistory.delete(conversationId);
  }

  getConversationHistory(conversationId: string): AIMessage[] {
    return this.conversationHistory.get(conversationId) || [];
  }
}

export const aiService = new AIService();
export default aiService;
export type { AIConfig, AIMessage };
