
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { aiService } from '@/lib/ai';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  typing?: boolean;
}

interface LiveChatProps {
  className?: string;
}

const LiveChat: React.FC<LiveChatProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI assistant for mybiz AI. I can help you learn about our platform, create websites, answer questions about our features, and guide you through the process. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const platformKnowledge = {
    platform: "mybiz AI",
    description: "AI-powered website builder that transforms business descriptions into beautiful, functional websites in under 60 seconds",
    features: [
      "AI-powered website generation",
      "Drag-and-drop editor",
      "SEO optimization",
      "Mobile responsive design",
      "CMS integration",
      "Blog management",
      "Contact forms",
      "Analytics dashboard",
      "Custom domains",
      "API access"
    ],
    pricing: {
      free: "Free tier with basic features",
      pro: "Pro plan with advanced features",
      enterprise: "Enterprise solutions with custom features"
    },
    process: [
      "Describe your business",
      "AI generates your website",
      "Customize with our editor",
      "Publish and manage"
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();

    // Platform-specific responses
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return "Our pricing is designed to be accessible for everyone:\n\n• **Free Plan**: Perfect for getting started with basic website creation\n• **Pro Plan**: Advanced features for growing businesses\n• **Enterprise**: Custom solutions for large organizations\n\nWould you like to see detailed pricing information or start with our free tier?";
    }

    if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('create'))) {
      return "Creating a website with mybiz AI is incredibly simple:\n\n1. **Describe your business** - Tell us about your company, services, and goals\n2. **AI generates your site** - Our AI creates a complete website in under 60 seconds\n3. **Customize easily** - Use our intuitive editor to make any changes\n4. **Publish instantly** - Your website goes live immediately\n\nWant to try it now? I can guide you through creating your first website!";
    }

    if (lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
      return "mybiz AI offers powerful features for modern websites:\n\n✨ **AI Website Generation** - Complete sites from business descriptions\n🎨 **Visual Editor** - Drag-and-drop customization\n📱 **Mobile Responsive** - Perfect on all devices\n🔍 **SEO Optimized** - Built-in search engine optimization\n📝 **Blog & CMS** - Content management made easy\n📊 **Analytics** - Track your website performance\n🌐 **Custom Domains** - Use your own domain name\n🔧 **API Access** - Integrate with other tools\n\nWhich feature interests you most?";
    }

    if (lowerMessage.includes('api') || lowerMessage.includes('integration')) {
      return "Our API allows developers to integrate mybiz AI into their applications:\n\n• **Website Generation API** - Programmatically create websites\n• **Content Management** - Manage site content via API\n• **User Management** - Handle user accounts and permissions\n• **Analytics API** - Access website performance data\n\nWould you like to see our API documentation or get started with an API key?";
    }

    if (lowerMessage.includes('blog') || lowerMessage.includes('content')) {
      return "Our built-in CMS makes content management effortless:\n\n📝 **Blog Management** - Create and manage blog posts\n📰 **News & Updates** - Keep your audience informed\n🏷️ **Categories & Tags** - Organize your content\n✍️ **Rich Text Editor** - Professional content creation\n📅 **Scheduling** - Plan your content calendar\n\nWant to see how easy it is to add a blog to your website?";
    }

    if (lowerMessage.includes('seo') || lowerMessage.includes('search')) {
      return "SEO is built into every mybiz AI website:\n\n🔍 **Automatic SEO** - Meta tags, descriptions, and structure\n📊 **Performance** - Fast loading times for better rankings\n📱 **Mobile-First** - Google's mobile-first indexing ready\n🗺️ **Sitemaps** - Automatic sitemap generation\n🔗 **Schema Markup** - Rich snippets for better visibility\n\nYour website will be optimized for search engines from day one!";
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! Here's how you can get support:\n\n💬 **Live Chat** - You're already here! Ask me anything\n📚 **Documentation** - Comprehensive guides and tutorials\n🎥 **Video Tutorials** - Step-by-step video guides\n👥 **Community** - Connect with other users\n📧 **Email Support** - Direct support for complex issues\n\nWhat specific help do you need today?";
    }

    if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('create')) {
      return "Ready to create your website? Here's how to get started:\n\n1. **Click 'Get Started'** - Begin your website creation journey\n2. **Describe your business** - Tell us about your company in a few sentences\n3. **Review your site** - See what our AI creates for you\n4. **Customize & publish** - Make it yours and go live!\n\nShall I guide you to the website creation page?";
    }

    // Default helpful response
    return "I'm here to help you with mybiz AI! I can assist with:\n\n• **Getting started** with website creation\n• **Understanding our features** and pricing\n• **Learning how to use** our platform\n• **Technical questions** about our tools\n• **Guidance** on best practices\n\nWhat would you like to know about mybiz AI?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await generateResponse(userMessage.content);
      
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I'm having trouble responding right now. Please try again or contact our support team for assistance.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`w-96 shadow-2xl border-0 bg-white transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">mybiz AI Assistant</CardTitle>
                <p className="text-xs text-indigo-100">Here to help you succeed</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[440px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.type === 'user' ? 'bg-indigo-500' : 'bg-gray-300'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {message.content}
                          </p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'
                          }`}>
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
                    <div className="bg-gray-100 text-gray-900 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about mybiz AI..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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

export default LiveChat;
