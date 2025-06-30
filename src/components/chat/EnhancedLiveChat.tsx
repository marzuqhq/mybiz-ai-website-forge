
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import sdk from '@/lib/sdk';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'code' | 'image';
}

interface ChatContext {
  currentPage: string;
  websiteData?: any;
  userHistory: Message[];
  businessInfo?: any;
}

const EnhancedLiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ChatContext>({
    currentPage: window.location.pathname,
    userHistory: [],
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Load chat history from sessionStorage
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chat-messages');
    const savedContext = sessionStorage.getItem('chat-context');
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
    
    if (savedContext) {
      try {
        setContext(JSON.parse(savedContext));
      } catch (error) {
        console.error('Failed to load chat context:', error);
      }
    }

    // Initialize with welcome message if no history
    if (!savedMessages || JSON.parse(savedMessages).length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: `👋 Hello! I'm your AI assistant. I can help you with:

- **Website questions** and navigation
- **Business information** and services  
- **Product details** and recommendations
- **Technical support** and troubleshooting
- **General inquiries** about our offerings

How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Update context when page changes
  useEffect(() => {
    const newContext = {
      ...context,
      currentPage: window.location.pathname,
    };
    setContext(newContext);
    sessionStorage.setItem('chat-context', JSON.stringify(newContext));
  }, [window.location.pathname]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enhanced AI response with context awareness
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Get business context
      const websites = await sdk.get('websites');
      const currentWebsite = websites[0]; // Assuming first website for demo
      
      let contextualInfo = '';
      
      // Add page-specific context
      switch (context.currentPage) {
        case '/':
          contextualInfo = 'User is on the homepage. ';
          break;
        case '/blog':
          const blogPosts = await sdk.get('blog_posts');
          contextualInfo = `User is on the blog page. We have ${blogPosts.length} blog posts available. `;
          break;
        case '/products':
          const products = await sdk.get('products');
          contextualInfo = `User is on the products page. We have ${products.length} products available. `;
          break;
        default:
          contextualInfo = `User is on page: ${context.currentPage}. `;
      }

      // Business information context
      if (currentWebsite?.businessInfo) {
        contextualInfo += `Business: ${currentWebsite.businessInfo.name || 'Our Company'}. `;
      }

      // Simple AI response logic (in production, you'd integrate with OpenAI, Claude, etc.)
      const responses = {
        greeting: [
          "Hello! I'm here to help you with any questions about our website, products, or services.",
          "Hi there! What can I help you with today?",
          "Welcome! I'm your AI assistant. How may I assist you?"
        ],
        products: [
          `${contextualInfo}I can help you find the perfect product for your needs. What are you looking for?`,
          "Let me help you explore our product offerings. What specific type of product interests you?",
          "I'd be happy to recommend products based on your requirements. What are you shopping for?"
        ],
        support: [
          "I'm here to help with any technical issues or questions you might have. What's the problem?",
          "Let me assist you with that. Can you describe what you're experiencing?",
          "I'll do my best to help resolve your issue. What seems to be the trouble?"
        ],
        default: [
          `${contextualInfo}That's an interesting question. Let me help you with that.`,
          "I understand your question. Here's what I can tell you...",
          "Based on your inquiry, here's some helpful information..."
        ]
      };

      // Determine response category
      const lowerMessage = userMessage.toLowerCase();
      let category = 'default';
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        category = 'greeting';
      } else if (lowerMessage.includes('product') || lowerMessage.includes('buy') || lowerMessage.includes('shop')) {
        category = 'products';
      } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
        category = 'support';
      }

      // Return a random response from the category
      const categoryResponses = responses[category as keyof typeof responses];
      const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

      // Add specific information based on the query
      let additionalInfo = '';
      
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        additionalInfo += '\n\n💰 **Pricing Information:**\nOur pricing is competitive and transparent. Would you like me to show you specific pricing for any particular service or product?';
      }
      
      if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
        additionalInfo += '\n\n📞 **Contact Information:**\n- Email: hello@business.com\n- Phone: +1 (555) 123-4567\n- Hours: Mon-Fri 9AM-6PM EST';
      }

      if (lowerMessage.includes('blog') || lowerMessage.includes('article')) {
        const blogPosts = await sdk.get('blog_posts');
        if (blogPosts.length > 0) {
          const recentPost = blogPosts[0];
          additionalInfo += `\n\n📝 **Latest Blog Post:**\n**${recentPost.title}**\n${recentPost.excerpt || recentPost.content.substring(0, 100) + '...'}`;
        }
      }

      return randomResponse + additionalInfo;

    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or feel free to contact our support team directly.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Store conversation context
    const updatedContext = {
      ...context,
      userHistory: [...context.userHistory, userMessage]
    };
    setContext(updatedContext);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = await generateAIResponse(userMessage.content);
      
      const botMessage: Message = {
        id: 'bot-' + Date.now(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Save conversation to database
      try {
        const conversation = {
          websiteId: 'current-website',
          messages: [...context.userHistory, userMessage, botMessage],
          context: updatedContext,
          status: 'active'
        };
        
        await sdk.insert('chat_conversations', conversation);
      } catch (error) {
        console.warn('Failed to save conversation:', error);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const clearChat = () => {
    setMessages([]);
    setContext({ currentPage: window.location.pathname, userHistory: [] });
    sessionStorage.removeItem('chat-messages');
    sessionStorage.removeItem('chat-context');
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome-' + Date.now(),
      content: "Chat cleared! How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 h-[600px] shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Online</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeChat}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex flex-col h-[500px] p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-white border shadow-sm'
                      }`}>
                        {message.sender === 'bot' ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                code: ({ children, className, ...props }) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const language = match ? match[1] : '';
                                  
                                  if (language) {
                                    const customStyles: { [key: string]: React.CSSProperties } = {
                                      'pre[class*="language-"]': {
                                        margin: 0,
                                        borderRadius: '6px',
                                        fontSize: '0.875rem'
                                      }
                                    };

                                    return (
                                      <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={language}
                                        PreTag="div"
                                        customStyle={customStyles}
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    );
                                  }
                                  
                                  return (
                                    <code 
                                      className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm" 
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${
                        message.sender === 'user' ? 'text-right' : ''
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border shadow-sm rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-blue-500 hover:bg-blue-600 h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default EnhancedLiveChat;
