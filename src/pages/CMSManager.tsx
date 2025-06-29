
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, FileText, HelpCircle, Package, BarChart3, Users, Mail, DollarSign, FormInput } from 'lucide-react';
import sdk from '@/lib/sdk';
import BlogManager from '@/components/cms/BlogManager';
import FAQManager from '@/components/cms/FAQManager';
import ProductManager from '@/components/cms/ProductManager';
import CRMManager from '@/components/cms/CRMManager';
import EmailMarketingManager from '@/components/cms/EmailMarketingManager';
import InvoiceManager from '@/components/cms/InvoiceManager';
import FormBuilderManager from '@/components/cms/FormBuilderManager';
import EnhancedLiveChat from '@/components/chat/EnhancedLiveChat';
import AICMSController from '@/lib/ai-cms-controller';

interface Website {
  id: string;
  userId: string;
  name: string;
  businessInfo: any;
}

const CMSManager: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [website, setWebsite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiController, setAiController] = useState<AICMSController | null>(null);

  useEffect(() => {
    loadWebsite();
  }, [websiteId]);

  const loadWebsite = async () => {
    if (!websiteId || !user?.id) return;

    try {
      setIsLoading(true);
      const websites = await sdk.get<Website>('websites');
      const websiteData = websites.find(w => w.id === websiteId);
      
      if (!websiteData || websiteData.userId !== user.id) {
        navigate('/');
        return;
      }
      
      setWebsite(websiteData);
      
      // Initialize AI controller
      const controller = new AICMSController({
        websiteId: websiteData.id,
        userId: websiteData.userId,
        context: {
          businessType: websiteData.businessInfo?.type || 'general',
          industry: websiteData.businessInfo?.industry || 'technology',
          targetAudience: websiteData.businessInfo?.targetAudience || 'professionals',
          brand: {
            name: websiteData.name,
            voice: websiteData.businessInfo?.brandVoice || 'professional',
            values: websiteData.businessInfo?.values || ['innovation', 'quality', 'customer-focus']
          }
        }
      });
      setAiController(controller);
      
    } catch (error) {
      console.error('Failed to load website:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI-Powered CMS...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Website not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/website/${websiteId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{website.name} - AI CMS</h1>
              <p className="text-sm text-gray-500">Complete business management platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Blog</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>CRM</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="forms" className="flex items-center space-x-2">
              <FormInput className="w-4 h-4" />
              <span>Forms</span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span>FAQs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <BlogManager websiteId={websiteId!} />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager websiteId={websiteId!} />
          </TabsContent>

          <TabsContent value="crm">
            <CRMManager websiteId={websiteId!} aiController={aiController} />
          </TabsContent>

          <TabsContent value="email">
            <EmailMarketingManager websiteId={websiteId!} aiController={aiController} />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoiceManager websiteId={websiteId!} />
          </TabsContent>

          <TabsContent value="forms">
            <FormBuilderManager websiteId={websiteId!} />
          </TabsContent>

          <TabsContent value="faqs">
            <FAQManager websiteId={websiteId!} businessInfo={website.businessInfo} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced AI Chat Assistant */}
      <EnhancedLiveChat />
    </div>
  );
};

export default CMSManager;
