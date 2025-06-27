
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/lib/ai';
import sdk from '@/lib/sdk';
import { 
  MessageSquare, 
  Wand2, 
  Plus, 
  FileText, 
  HelpCircle, 
  Package,
  Send,
  Sparkles,
  Lightbulb
} from 'lucide-react';

interface Website {
  id: string;
  name: string;
  businessInfo: any;
}

interface Page {
  id: string;
  title: string;
  type: string;
}

interface AIAssistantProps {
  website: Website;
  currentPage: Page;
  onClose: () => void;
  onContentUpdate: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  website,
  currentPage,
  onClose,
  onContentUpdate
}) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);

  const { toast } = useToast();

  const quickActions = [
    {
      icon: <Plus className="w-4 h-4" />,
      label: "Add new page",
      prompt: "Create a new page for my website",
      category: "Pages"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Write blog post",
      prompt: "Write a blog post about my business industry",
      category: "Content"
    },
    {
      icon: <HelpCircle className="w-4 h-4" />,
      label: "Generate FAQs",
      prompt: "Create frequently asked questions for my business",
      category: "Content"
    },
    {
      icon: <Package className="w-4 h-4" />,
      label: "Add products/services",
      prompt: "Add products or services to my website",
      category: "Content"
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      label: "Improve SEO",
      prompt: "Suggest SEO improvements for my website",
      category: "Optimization"
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "Enhance content",
      prompt: "Make my website content more engaging and professional",
      category: "Enhancement"
    }
  ];

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setIsProcessing(true);
    setConversation(prev => [...prev, {
      type: 'user',
      content: message,
      timestamp: new Date()
    }]);

    try {
      // Process AI command based on the message
      let response = '';

      if (message.toLowerCase().includes('create') && message.toLowerCase().includes('page')) {
        response = await handleCreatePage(message);
      } else if (message.toLowerCase().includes('blog') && message.toLowerCase().includes('post')) {
        response = await handleCreateBlogPost(message);
      } else if (message.toLowerCase().includes('faq')) {
        response = await handleGenerateFAQs(message);
      } else if (message.toLowerCase().includes('product') || message.toLowerCase().includes('service')) {
        response = await handleAddProducts(message);
      } else if (message.toLowerCase().includes('seo')) {
        response = await handleSEOSuggestions(message);
      } else {
        // General AI assistance
        response = await aiService.generate([
          {
            role: 'system',
            content: `You are an AI assistant helping with website management for ${website.name}. 
                     Business info: ${JSON.stringify(website.businessInfo)}
                     Current page: ${currentPage.title}
                     Provide helpful, specific advice for their website.`
          },
          {
            role: 'user',
            content: message
          }
        ]).then(res => res.content);
      }

      setConversation(prev => [...prev, {
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }]);

    } catch (error: any) {
      console.error('AI Assistant error:', error);
      toast({
        title: "Assistant error",
        description: error.message || "Failed to process your request.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setInput('');
    }
  };

  const handleCreatePage = async (prompt: string): Promise<string> => {
    try {
      // Extract page type from prompt or default to 'page'
      const pageTypes = ['about', 'services', 'contact', 'blog', 'pricing', 'testimonials'];
      const detectedType = pageTypes.find(type => 
        prompt.toLowerCase().includes(type)
      ) || 'page';

      // Generate page title from prompt
      const titleMatch = prompt.match(/create\s+(?:a\s+)?(?:new\s+)?(.+?)\s+page/i);
      const pageTitle = titleMatch ? 
        titleMatch[1].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
        : 'New Page';

      // Create the page
      const newPage = await sdk.insert('pages', {
        websiteId: website.id,
        title: pageTitle,
        slug: `/${pageTitle.toLowerCase().replace(/\s+/g, '-')}`,
        type: detectedType,
        seoMeta: {
          title: `${pageTitle} - ${website.name}`,
          description: `${pageTitle} page for ${website.name}`,
          keywords: [pageTitle.toLowerCase(), website.businessInfo?.type || 'business']
        }
      });

      // Generate basic content blocks for the page
      if (detectedType === 'about') {
        const aboutContent = await aiService.generate([
          {
            role: 'system',
            content: 'Create an about page section with title and description for a business.'
          },
          {
            role: 'user',
            content: `Business: ${website.businessInfo?.description || website.name}`
          }
        ]);

        await sdk.insert('blocks', {
          pageId: newPage.id,
          type: 'about',
          content: JSON.parse(aboutContent.content),
          order: 0,
          aiGenerated: true,
          editable: true
        });
      }

      onContentUpdate();
      return `Successfully created "${pageTitle}" page! You can now edit it and add more content.`;
    } catch (error: any) {
      throw new Error(`Failed to create page: ${error.message}`);
    }
  };

  const handleCreateBlogPost = async (prompt: string): Promise<string> => {
    try {
      const blogPost = await aiService.generateBlogPost(
        `Blog post for ${website.name}`,
        [website.businessInfo?.type || 'business', 'tips', 'advice'],
        website.businessInfo?.tone || 'professional'
      );

      await sdk.insert('posts', {
        websiteId: website.id,
        title: blogPost.title,
        slug: blogPost.slug,
        markdownBody: blogPost.content,
        tags: blogPost.tags,
        summary: blogPost.summary,
        publishedAt: new Date().toISOString()
      });

      onContentUpdate();
      return `Created a new blog post: "${blogPost.title}". You can edit it in the blog section.`;
    } catch (error: any) {
      throw new Error(`Failed to create blog post: ${error.message}`);
    }
  };

  const handleGenerateFAQs = async (prompt: string): Promise<string> => {
    try {
      const faqs = await aiService.generateFAQs(
        website.businessInfo?.type || 'business',
        website.businessInfo?.services?.split(',') || ['service']
      );

      for (const faq of faqs) {
        await sdk.insert('faqs', {
          websiteId: website.id,
          question: faq.question,
          answer: faq.answer,
          aiGenerated: true
        });
      }

      onContentUpdate();
      return `Generated ${faqs.length} FAQs for your website. You can view and edit them in the FAQ section.`;
    } catch (error: any) {
      throw new Error(`Failed to generate FAQs: ${error.message}`);
    }
  };

  const handleAddProducts = async (prompt: string): Promise<string> => {
    try {
      // This is a simplified product generation - in a real app, you'd want more specific prompts
      const productIdeas = await aiService.generate([
        {
          role: 'system',
          content: 'Generate 3 product/service ideas for this business with title, description, and price.'
        },
        {
          role: 'user',
          content: `Business: ${website.businessInfo?.description || website.name}`
        }
      ]);

      onContentUpdate();
      return `Here are some product/service ideas for your business:\n\n${productIdeas.content}\n\nYou can add these manually in the products section.`;
    } catch (error: any) {
      throw new Error(`Failed to generate product ideas: ${error.message}`);
    }
  };

  const handleSEOSuggestions = async (prompt: string): Promise<string> => {
    try {
      const seoSuggestions = await aiService.generate([
        {
          role: 'system',
          content: 'Provide SEO improvement suggestions for this business website.'
        },
        {
          role: 'user',
          content: `Business: ${website.name}, Type: ${website.businessInfo?.type}, Description: ${website.businessInfo?.description}`
        }
      ]);

      return seoSuggestions.content;
    } catch (error: any) {
      throw new Error(`Failed to generate SEO suggestions: ${error.message}`);
    }
  };

  const handleQuickAction = (action: typeof quickActions[0]) => {
    setInput(action.prompt);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            AI Assistant
          </DialogTitle>
          <DialogDescription>
            Ask me anything about your website or use quick actions below
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Quick Actions */}
          <div className="w-80 space-y-4">
            <h3 className="font-medium text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleQuickAction(action)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">{action.icon}</div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.category}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {conversation.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Hi! I'm your AI assistant. How can I help improve your website today?</p>
                </div>
              ) : (
                conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your website..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(input)}
                disabled={isProcessing}
              />
              <Button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isProcessing}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistant;
