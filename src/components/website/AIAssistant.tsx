
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Send, Bot, User, Sparkles, Lightbulb, Zap } from 'lucide-react';

interface AIAssistantProps {
  website: any;
  currentPage: any;
  onClose: () => void;
  onContentUpdate: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  website,
  currentPage,
  onClose,
  onContentUpdate
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hi! I'm your AI assistant for ${website.name}. I can help you improve your website, create new content, or answer questions about your ${currentPage?.title || 'current'} page. What would you like to work on?`,
      timestamp: new Date(),
      suggestions: [
        'Add a testimonials section',
        'Improve SEO for this page',
        'Create a blog post',
        'Add a pricing section'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const quickActions = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: 'Improve Content',
      description: 'Make existing content more engaging',
      action: 'improve-content'
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      title: 'Add New Section',
      description: 'Create new content sections',
      action: 'add-section'
    },
    {
      icon: <Zap className="w-4 h-4" />,
      title: 'SEO Analysis',
      description: 'Optimize for search engines',
      action: 'seo-analysis'
    },
    {
      icon: <Bot className="w-4 h-4" />,
      title: 'Content Ideas',
      description: 'Get suggestions for new content',
      action: 'content-ideas'
    }
  ];

  const handleSendMessage = async (message?: string) => {
    const messageText = message || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(messageText),
        timestamp: new Date(),
        suggestions: getSuggestionsForMessage(messageText)
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('testimonial')) {
      return "I can help you add a testimonials section! This will build trust with visitors. I'll create a section with placeholder testimonials that you can replace with real customer feedback. Would you like me to add this to your current page?";
    }

    if (lowerMessage.includes('seo') || lowerMessage.includes('optimize')) {
      return "Great idea! I can help optimize your page for search engines. I notice your page could benefit from better meta descriptions and more strategic keyword placement. Should I update the SEO settings for this page?";
    }

    if (lowerMessage.includes('blog') || lowerMessage.includes('post')) {
      return "I'd love to help you create blog content! Blog posts are great for SEO and engaging visitors. What topic would you like to write about? I can suggest topics based on your business type or you can tell me what you have in mind.";
    }

    if (lowerMessage.includes('pricing')) {
      return "Adding a pricing section is a great way to be transparent with potential customers. I can create a pricing table with different tiers. How many pricing options do you want to offer, and do you have specific prices in mind?";
    }

    if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      return "I can definitely help improve your content! I can make it more engaging, professional, or customer-focused. Which section would you like me to focus on first? I can also suggest improvements for the overall page structure.";
    }

    // Default response
    return "I understand you'd like help with that. I can assist with content creation, SEO optimization, adding new sections, or improving existing content. Could you be more specific about what you'd like to work on?";
  };

  const getSuggestionsForMessage = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('testimonial')) {
      return [
        'Add testimonials section now',
        'Create customer review form',
        'Show me testimonial examples'
      ];
    }

    if (lowerMessage.includes('seo')) {
      return [
        'Update meta descriptions',
        'Analyze keyword usage',
        'Improve page headings'
      ];
    }

    if (lowerMessage.includes('blog')) {
      return [
        'Create first blog post',
        'Set up blog categories',
        'Suggest blog topics'
      ];
    }

    return [
      'Tell me more',
      'Show me an example',
      'What else can you help with?'
    ];
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      'improve-content': 'Help me improve the content on this page to make it more engaging and professional',
      'add-section': 'I want to add a new section to this page. What would you recommend?',
      'seo-analysis': 'Can you analyze this page for SEO and give me recommendations?',
      'content-ideas': 'Give me some content ideas for my website based on my business type'
    };

    handleSendMessage(actionMessages[action as keyof typeof actionMessages]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[600px] shadow-2xl">
        <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">AI Assistant</CardTitle>
                <CardDescription>
                  Get help with {website.name} • {currentPage?.title || 'Current page'}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="flex h-[500px]">
          {/* Quick Actions Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  className="w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                      {action.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900">{action.title}</div>
                      <div className="text-xs text-gray-600">{action.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
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
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          {message.suggestions && (
                            <div className="mt-3 space-y-1">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="block w-full text-left text-xs px-3 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 rounded-lg p-4 max-w-[80%]">
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
            </ScrollArea>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your website..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isThinking}
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isThinking}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
