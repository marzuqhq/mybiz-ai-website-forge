import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import sdk from '@/lib/sdk';
import BlogManager from '@/components/cms/BlogManager';
import FAQManager from '@/components/cms/FAQManager';
import ProductManager from '@/components/cms/ProductManager';
import CRMManager from '@/components/cms/CRMManager';
import EmailMarketingManager from '@/components/cms/EmailMarketingManager';
import InvoiceManager from '@/components/cms/InvoiceManager';
import FormBuilderManager from '@/components/cms/FormBuilderManager';
import MobileCMSMenu from '@/components/cms/MobileCMSMenu';
import BusinessToolsCenter from '@/components/tools/BusinessToolsCenter';
import EnhancedLiveChat from '@/components/chat/EnhancedLiveChat';
import AICMSController from '@/lib/ai-cms-controller';

interface Website {
  id: string;
  userId: string;
  name: string;
  slug: string;
  businessInfo: any;
}

const CMSManager: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [website, setWebsite] = useState<Website | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiController, setAiController] = useState<AICMSController | null>(null);
  const [activeModule, setActiveModule] = useState('blog');

  useEffect(() => {
    loadWebsite();
  }, [websiteId]);

  const loadWebsite = async () => {
    if (!websiteId || !user?.id) return;

    try {
      setIsLoading(true);
      const websites = await sdk.get('websites');
      const websiteData = websites.find((w: Website) => w.id === websiteId);
      
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

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'blog':
        return <BlogManager websiteId={websiteId!} />;
      case 'products':
        return <ProductManager websiteId={websiteId!} />;
      case 'crm':
        return <CRMManager websiteId={websiteId!} aiController={aiController} />;
      case 'email':
        return <EmailMarketingManager websiteId={websiteId!} aiController={aiController} />;
      case 'invoices':
        return <InvoiceManager websiteId={websiteId!} />;
      case 'forms':
        return <FormBuilderManager websiteId={websiteId!} />;
      case 'faqs':
        return <FAQManager websiteId={websiteId!} businessInfo={website?.businessInfo} />;
      case 'tools':
        return <BusinessToolsCenter />;
      default:
        return <BlogManager websiteId={websiteId!} />;
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
      <header className="bg-white border-b border-gray-200 px-6 py-4 lg:pl-80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/website/${websiteId}`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{website.name} - AI CMS</h1>
              <p className="text-sm text-gray-500">
                Published at: mybiz.top/{website.slug || 'your-website'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Mobile CMS Menu */}
        <MobileCMSMenu
          onModuleSelect={setActiveModule}
          activeModule={activeModule}
          modules={[
            {
              id: 'blog',
              name: 'Blog Manager',
              description: 'Create and manage blog posts',
              icon: <div>📝</div>,
              color: 'bg-blue-500',
              component: 'BlogManager'
            },
            {
              id: 'products',
              name: 'Product Catalog',
              description: 'Manage your products',
              icon: <div>📦</div>,
              color: 'bg-green-500',
              component: 'ProductManager'
            },
            {
              id: 'crm',
              name: 'Customer Relations',
              description: 'Manage customers and leads',
              icon: <div>👥</div>,
              color: 'bg-purple-500',
              component: 'CRMManager'
            },
            {
              id: 'email',
              name: 'Email Marketing',
              description: 'Create email campaigns',
              icon: <div>📧</div>,
              color: 'bg-orange-500',
              component: 'EmailMarketingManager'
            },
            {
              id: 'invoices',
              name: 'Invoice Management',
              description: 'Create and track invoices',
              icon: <div>💰</div>,
              color: 'bg-emerald-500',
              component: 'InvoiceManager'
            },
            {
              id: 'forms',
              name: 'Form Builder',
              description: 'Build custom forms',
              icon: <div>📋</div>,
              color: 'bg-pink-500',
              component: 'FormBuilderManager'
            },
            {
              id: 'faqs',
              name: 'FAQ Manager',
              description: 'Manage FAQs',
              icon: <div>❓</div>,
              color: 'bg-yellow-500',
              component: 'FAQManager'
            },
            {
              id: 'tools',
              name: 'Business Tools',
              description: '25+ business tools',
              icon: <div>🛠️</div>,
              color: 'bg-indigo-500',
              isNew: true,
              component: 'BusinessToolsCenter'
            }
          ]}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:pl-6">
          {renderActiveModule()}
        </div>
      </div>

      {/* Enhanced AI Chat Assistant */}
      <EnhancedLiveChat />
    </div>
  );
};

export default CMSManager;
