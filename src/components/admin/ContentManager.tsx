import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { sdk } from '@/lib/sdk';
import AICMSController from '@/lib/ai-cms-controller';
import subdomainRouter from '@/lib/subdomain-router';
import CRMManager from './CRMManager';
import EmailMarketing from './EmailMarketing';
import InvoiceManager from './InvoiceManager';
import FormBuilder from './FormBuilder';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Mail,
  DollarSign,
  FormInput,
  UserCheck,
  Bot,
  BarChart3,
  ShoppingCart,
  Package
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  author: string;
  aiGenerated?: boolean;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: string;
}

interface Website {
  id: string;
  name: string;
  subdomain: string;
  status: string;
  userId: string;
}

const ContentManager: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiController, setAiController] = useState<AICMSController | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [postsData, contactsData, websitesData] = await Promise.all([
        sdk.get('posts'),
        sdk.get('contacts'),
        sdk.get('websites')
      ]);
      setBlogPosts(postsData || []);
      setContacts(contactsData || []);
      setWebsites(websitesData || []);
      
      // Initialize AI controller with first website
      if (websitesData.length > 0) {
        const website = websitesData[0];
        setSelectedWebsite(website);
        initializeAIController(website);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load content data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAIController = (website: Website) => {
    const controller = new AICMSController({
      websiteId: website.id,
      userId: website.userId,
      context: {
        businessType: 'general',
        industry: 'technology',
        targetAudience: 'professionals',
        brand: {
          name: website.name,
          voice: 'professional',
          values: ['innovation', 'quality', 'customer-focus']
        }
      }
    });
    setAiController(controller);
  };

  const handleCreateBlogPost = async () => {
    try {
      const newPost = await sdk.insert('posts', {
        websiteId: selectedWebsite?.id || '',
        title: 'New Blog Post',
        content: 'Start writing your content here...',
        status: 'draft' as const,
        author: 'Admin',
        slug: `new-post-${Date.now()}`,
        createdAt: new Date().toISOString()
      });
      setBlogPosts([newPost, ...blogPosts]);
      toast({
        title: "Blog post created",
        description: "New blog post has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create blog post:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    }
  };

  const handleAIGenerateBlogPost = async () => {
    if (!aiController) return;
    
    try {
      const topic = prompt('Enter the blog post topic:');
      if (!topic) return;
      
      const keywords = prompt('Enter keywords (comma-separated):')?.split(',') || [];
      
      toast({
        title: "Generating content...",
        description: "AI is creating your blog post. This may take a few moments.",
      });

      const aiPost = await aiController.generateBlogPost(topic, keywords);
      setBlogPosts([aiPost, ...blogPosts]);
      
      toast({
        title: "AI content generated",
        description: "Your blog post has been created successfully!",
      });
    } catch (error) {
      console.error('AI generation failed:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate AI content.",
        variant: "destructive",
      });
    }
  };

  const handleCreateSubdomain = async (websiteId: string) => {
    try {
      const subdomain = prompt('Enter desired subdomain:');
      if (!subdomain) return;

      const isAvailable = await subdomainRouter.isSubdomainAvailable(subdomain);
      if (!isAvailable) {
        toast({
          title: "Subdomain unavailable",
          description: "This subdomain is already taken.",
          variant: "destructive",
        });
        return;
      }

      const website = websites.find(w => w.id === websiteId);
      if (!website) return;

      await sdk.update('websites', websiteId, {
        subdomain: subdomain,
        subdomainPath: `/${subdomain}`
      });

      await subdomainRouter.registerSubdomain(subdomain, websiteId, website.userId);

      setWebsites(websites.map(w => 
        w.id === websiteId 
          ? { ...w, subdomain } 
          : w
      ));

      toast({
        title: "Subdomain created",
        description: `Your website is now available at ${subdomain}.mybiz.top`,
      });
    } catch (error) {
      console.error('Subdomain creation failed:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create subdomain.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      await sdk.update('contacts', id, { status });
      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
      toast({
        title: "Status updated",
        description: "Contact status has been updated.",
      });
    } catch (error) {
      console.error('Failed to update contact status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update contact status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">AI-Powered CMS Management</h2>
        {selectedWebsite && (
          <Badge variant="outline" className="text-sm">
            Active: {selectedWebsite.name}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="subdomains">Subdomains</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Products</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Customers</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">$0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={handleAIGenerateBlogPost} className="flex items-center">
                  <Bot className="w-4 h-4 mr-2" />
                  Generate Blog Post
                </Button>
                <Button variant="outline" className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Generate Products
                </Button>
                <Button variant="outline" className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Generate FAQs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Blog Posts</h3>
            <div className="flex space-x-2">
              <Button onClick={handleAIGenerateBlogPost} variant="outline">
                <Bot className="w-4 h-4 mr-2" />
                AI Generate
              </Button>
              <Button onClick={handleCreateBlogPost}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      {post.title}
                      {post.aiGenerated && (
                        <Badge variant="secondary" className="ml-2">
                          <Bot className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-4">
          <h3 className="text-lg font-semibold">E-commerce Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Products</h4>
                <p className="text-sm text-gray-600 mb-4">Manage your product catalog</p>
                <Button className="w-full">Manage Products</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Orders</h4>
                <p className="text-sm text-gray-600 mb-4">Track and fulfill orders</p>
                <Button className="w-full">View Orders</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Analytics</h4>
                <p className="text-sm text-gray-600 mb-4">Sales and performance metrics</p>
                <Button className="w-full">View Analytics</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subdomains" className="space-y-4">
          <h3 className="text-lg font-semibold">Subdomain Management</h3>
          <div className="grid gap-4">
            {websites.map((website) => (
              <Card key={website.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{website.name}</CardTitle>
                    <Badge variant={website.subdomain ? 'default' : 'secondary'}>
                      {website.subdomain ? 'Active' : 'No Subdomain'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {website.subdomain ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Available at: <strong>{website.subdomain}.mybiz.top</strong>
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://${website.subdomain}.mybiz.top`, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Visit Site
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">No subdomain configured</p>
                      <Button 
                        onClick={() => handleCreateSubdomain(website.id)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Create Subdomain
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <CRMManager />
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <EmailMarketing />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceManager />
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <FormBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
