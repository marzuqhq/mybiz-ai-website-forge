
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

interface ChatMemory {
  sessionId: string;
  messages: Message[];
  context: {
    userInfo?: any;
    currentPath?: string;
    websiteData?: any;
    preferences?: any;
  };
  lastActivity: Date;
}

const EnhancedLiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [chatMemory, setChatMemory] = useState<ChatMemory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // AI Assistant with enhanced capabilities and memory
  const aiResponses = {
    greetings: [
      "Hello! I'm your AI business assistant. I have access to your website data and can help you with content creation, customer management, analytics insights, and much more. How can I assist you today?",
      "Hi there! I'm here to help you grow your business with AI-powered insights. I can generate content, analyze your data, manage your CRM, and provide strategic recommendations. What would you like to work on?",
      "Welcome! I'm your intelligent business companion. I can help you create blog posts, manage products, analyze customer data, and provide personalized business advice. What's on your mind?"
    ],
    
    contentGeneration: [
      "I can help you create amazing content! I can generate blog posts, product descriptions, email campaigns, social media content, and more. What type of content would you like me to create?",
      "Content creation is one of my specialties! Whether you need blog articles, marketing copy, product descriptions, or social media posts, I can generate high-quality, engaging content tailored to your brand. What shall we create together?"
    ],
    
    businessAnalysis: [
      "I can analyze your business data to provide valuable insights! I can look at your customer trends, sales patterns, content performance, and suggest improvements. Which aspect of your business would you like me to analyze?",
      "Let me help you understand your business better! I can examine your customer data, product performance, website analytics, and provide actionable recommendations. What metrics are you interested in?"
    ],
    
    automation: [
      "I can help automate many aspects of your business! From email marketing campaigns to customer follow-ups, inventory management to content scheduling - what would you like to automate?",
      "Automation is key to scaling your business! I can set up automated workflows for customer onboarding, email sequences, social media posting, and much more. What processes would you like to streamline?"
    ]
  };

  // Enhanced AI response generation with context awareness
  const generateAIResponse = async (userMessage: string, context: ChatMemory['context']): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses
    if (context.currentPath?.includes('/cms') || message.includes('cms') || message.includes('content')) {
      return `I see you're working with content management! Here are some things I can help you with:

## Content Creation
- **Blog Posts**: Generate SEO-optimized articles on any topic
- **Product Descriptions**: Create compelling product copy that converts  
- **Email Campaigns**: Design engaging email sequences
- **Social Media**: Generate posts for all major platforms

## Content Optimization
- Improve existing content for better SEO
- A/B test different headlines and descriptions
- Analyze content performance and suggest improvements

What type of content would you like to create or optimize? I can start generating it right away! 🚀`;
    }

    if (message.includes('customer') || message.includes('crm')) {
      return `I can help you master customer relationship management! Here's what I can do:

## Customer Analysis
- **Segmentation**: Group customers by behavior, value, and preferences
- **Lifetime Value**: Calculate and predict customer worth
- **Churn Prediction**: Identify at-risk customers before they leave

## Automated Workflows  
- **Welcome Sequences**: Onboard new customers automatically
- **Follow-up Campaigns**: Re-engage inactive customers
- **Personalized Offers**: Send targeted promotions based on behavior

## Customer Insights
- Generate detailed customer personas
- Analyze purchasing patterns and trends
- Recommend upselling and cross-selling opportunities

Would you like me to analyze your current customer data or set up automated workflows? 📊`;
    }

    if (message.includes('ecommerce') || message.includes('product') || message.includes('sales')) {
      return `Let me help you boost your e-commerce performance! Here's what I can do:

## Product Management
- **Smart Descriptions**: Generate converting product copy
- **SEO Optimization**: Improve product discoverability  
- **Pricing Strategies**: Analyze competitor pricing and suggest optimal prices
- **Inventory Insights**: Predict demand and optimize stock levels

## Sales Enhancement
- **Abandoned Cart Recovery**: Win back lost sales with smart automation
- **Upsell/Cross-sell**: Recommend complementary products
- **Dynamic Promotions**: Create personalized offers that convert

## Performance Analytics
- Track key metrics: conversion rates, AOV, LTV
- Identify top-performing products and optimize underperformers
- Seasonal trend analysis and forecasting

What aspect of your e-commerce would you like to optimize first? 🛒`;
    }

    if (message.includes('blog') || message.includes('article') || message.includes('write')) {
      return `I'm your expert content writer! Here's how I can help with your blog:

## Content Creation
\`\`\`markdown
# I can generate:
- SEO-optimized blog posts
- Engaging headlines that convert
- Meta descriptions and tags
- Social media snippets
\`\`\`

## Content Strategy
- **Topic Research**: Find trending topics in your niche
- **Editorial Calendar**: Plan your content for maximum impact
- **Keyword Optimization**: Ensure your content ranks well
- **Content Clusters**: Create topic authority with related posts

## Performance Optimization
- Analyze your top-performing content
- Suggest improvements for existing posts
- A/B test different approaches
- Track engagement and conversion metrics

Just give me a topic, and I'll create a complete blog post with proper formatting, SEO optimization, and engaging content! What would you like to write about? ✍️`;
    }

    if (message.includes('analytics') || message.includes('data') || message.includes('insights')) {
      return `I'm your data analyst! Here's how I can provide valuable business insights:

## Business Intelligence
- **Performance Dashboards**: Real-time business metrics
- **Trend Analysis**: Identify patterns in your data
- **Competitive Analysis**: Benchmark against industry standards
- **ROI Tracking**: Measure the impact of your strategies

## Predictive Analytics
- Forecast sales and revenue trends
- Predict customer behavior and preferences  
- Identify growth opportunities
- Risk assessment and mitigation strategies

## Custom Reports
\`\`\`javascript
// I can generate reports on:
const reportTypes = [
  'Customer acquisition costs',
  'Lifetime value analysis', 
  'Product performance metrics',
  'Marketing channel effectiveness',
  'Seasonal trends and patterns'
];
\`\`\`

What specific insights would you like me to analyze for your business? 📈`;
    }

    // Greeting detection
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || messages.length === 0) {
      return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
    }

    // General business questions
    if (message.includes('help') || message.includes('what can you do')) {
      return `I'm your AI-powered business assistant with comprehensive capabilities! Here's what I can help you with:

## 🚀 **Content & Marketing**
- Generate blog posts, product descriptions, and marketing copy
- Create email campaigns and social media content
- SEO optimization and keyword research

## 👥 **Customer Management**  
- CRM automation and customer segmentation
- Personalized marketing campaigns
- Customer lifecycle analysis and retention strategies

## 📊 **Business Analytics**
- Real-time performance dashboards
- Sales forecasting and trend analysis
- ROI tracking and optimization recommendations

## 🛒 **E-commerce Optimization**
- Product catalog management
- Pricing strategy optimization
- Inventory management and demand forecasting

## 🤖 **Process Automation**
- Workflow automation for repetitive tasks
- Customer service chatbots
- Automated reporting and alerts

I have access to your business data and can provide personalized insights and recommendations. What specific area would you like to focus on today?`;
    }

    // Default intelligent response
    return `I understand you're asking about "${userMessage}". Let me help you with that!

Based on your query, I can assist you with:

**Immediate Actions:**
- Generate specific content or copy
- Analyze your current business data
- Set up automated workflows
- Provide strategic recommendations

**Long-term Strategy:**
- Develop comprehensive marketing plans
- Optimize your business operations
- Implement growth strategies
- Create predictive models for better decision-making

Could you provide more details about what specific outcome you're looking for? I'm here to provide actionable solutions tailored to your business needs! 💡`;
  };

  // Load chat memory from localStorage
  useEffect(() => {
    const savedMemory = localStorage.getItem(`chat_memory_${sessionId}`);
    if (savedMemory) {
      const memory: ChatMemory = JSON.parse(savedMemory);
      setChatMemory(memory);
      setMessages(memory.messages);
    } else {
      // Initialize new chat session
      const initialMemory: ChatMemory = {
        sessionId,
        messages: [],
        context: {
          currentPath: window.location.pathname,
          websiteData: {},
          preferences: {}
        },
        lastActivity: new Date()
      };
      setChatMemory(initialMemory);
    }
  }, [sessionId]);

  // Save chat memory to localStorage
  useEffect(() => {
    if (chatMemory) {
      const updatedMemory = {
        ...chatMemory,
        messages,
        lastActivity: new Date()
      };
      setChatMemory(updatedMemory);
      localStorage.setItem(`chat_memory_${sessionId}`, JSON.stringify(updatedMemory));
    }
  }, [messages, chatMemory, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputValue, chatMemory?.context || {});
      
      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }, 1500 + Math.random() * 1000); // Realistic response time
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-white">
            AI
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bot className="w-5 h-5 mr-2" />
              AI Business Assistant
              <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
                Online
              </Badge>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Hi! I'm your AI business assistant. I can help you with content creation, 
                    customer management, analytics, and much more!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addSuggestion("Generate a blog post about AI in business")}
                    >
                      Generate Content
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addSuggestion("Analyze my customer data")}
                    >
                      Analyze Data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addSuggestion("What can you help me with?")}
                    >
                      Show Capabilities
                    </Button>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'ai' && (
                        <Bot className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        {message.sender === 'ai' ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                code({node, inline, className, children, ...props}) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      style={tomorrow}
                                      language={match[1]}
                                      PreTag="div"
                                      className="text-sm"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                }
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{message.content}</p>
                        )}
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border shadow-sm rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your business..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default EnhancedLiveChat;
