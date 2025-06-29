
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { sdk } from '@/lib/sdk';
import AICMSController from '@/lib/ai-cms-controller';
import subdomainRouter from '@/lib/subdomain-router';
import CRMManager from '../cms/CRMManager';
import EmailMarketingManager from '../cms/EmailMarketingManager';
import InvoiceManager from '../cms/InvoiceManager';
import FormBuilderManager from '../cms/FormBuilderManager';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Settings,
  Plus,
  Eye,
  Mail,
  DollarSign,
  FormInput,
  Bot,
  BarChart3,
  ShoppingCart,
  Package,
  UserCheck,
  CreditCard
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

interface Website {
  id: string;
  name: string;
  subdomain: string;
  status: string;
  userId: string;
}

const ContentManager: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
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
      const [postsData, websitesData, customersData, ordersData] = await Promise.all([
        sdk.get('posts'),
        sdk.get('websites'),
        sdk.get('customers'),
        sdk.get('orders')
      ]);
      setBlogPosts(postsData || []);
      setWebsites(websitesData || []);
      setCustomers(customersData || []);
      setOrders(ordersData || []);
      
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
        description: `Your website is now available at mybiz.top/${subdomain}`,
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
        <h2 className="text-2xl font-bold text-gray-900">AI-Powered Business Platform</h2>
        {selectedWebsite && (
          <Badge variant="outline" className="text-sm">
            Active: {selectedWebsite.name}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Business Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <Button variant="outline" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Generate Email Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Management</h3>
            <p className="text-gray-600 mb-6">
              Navigate to the CMS Manager to manage your blog posts.
            </p>
            <Button onClick={() => window.open('/cms-manager/' + selectedWebsite?.id, '_blank')}>
              Open Blog Manager
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-4">
          <h3 className="text-lg font-semibold">E-commerce Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Products</h4>
                <p className="text-sm text-gray-600 mb-4">Manage your product catalog with AI assistance</p>
                <Button className="w-full">Manage Products</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Inventory</h4>
                <p className="text-sm text-gray-600 mb-4">Track stock levels and manage inventory</p>
                <Button className="w-full">View Inventory</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Payments</h4>
                <p className="text-sm text-gray-600 mb-4">Configure payment methods and processing</p>
                <Button className="w-full">Setup Payments</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          {selectedWebsite && (
            <CRMManager websiteId={selectedWebsite.id} aiController={aiController} />
          )}
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          {selectedWebsite && (
            <EmailMarketingManager websiteId={selectedWebsite.id} aiController={aiController} />
          )}
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          {selectedWebsite && (
            <InvoiceManager websiteId={selectedWebsite.id} />
          )}
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          {selectedWebsite && (
            <FormBuilderManager websiteId={selectedWebsite.id} />
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Comprehensive business analytics and AI-powered insights coming soon.
            </p>
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
                        Available at: <strong>mybiz.top/{website.subdomain}</strong>
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`https://mybiz.top/${website.subdomain}`, '_blank')}
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
      </Tabs>
    </div>
  );
};

export default ContentManager;
