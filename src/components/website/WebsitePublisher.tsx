
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Copy, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Loader2,
  Eye,
  Settings,
  Zap
} from 'lucide-react';
import sdk from '@/lib/sdk';

interface Website {
  id: string;
  name: string;
  slug: string;
  status: string;
  publishedAt?: string;
  publicUrl: string;
  pages: any[];
  theme: any;
  seoConfig: any;
}

interface WebsitePublisherProps {
  website: Website;
  onUpdate: (updatedWebsite: Website) => void;
}

const WebsitePublisher: React.FC<WebsitePublisherProps> = ({ website, onUpdate }) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState(website.slug || '');
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [publishedUrl, setPublishedUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (website.slug) {
      setPublishedUrl(`https://mybiz.top/${website.slug}`);
    }
  }, [website.slug]);

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug === website.slug) {
      setSlugAvailable(true);
      return;
    }

    setIsCheckingSlug(true);
    try {
      const isAvailable = await sdk.isSlugAvailable(slug);
      setSlugAvailable(isAvailable);
    } catch (error) {
      console.error('Error checking slug availability:', error);
      setSlugAvailable(false);
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleSlugChange = (value: string) => {
    const cleanSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setNewSlug(cleanSlug);
    
    // Debounce slug checking
    const timeoutId = setTimeout(() => {
      checkSlugAvailability(cleanSlug);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const updateSlug = async () => {
    if (!newSlug || newSlug === website.slug || !slugAvailable) return;

    try {
      const updatedWebsite = await sdk.update('websites', website.id, {
        slug: newSlug,
        publicUrl: `https://mybiz.top/${newSlug}`,
        updatedAt: new Date().toISOString()
      });

      // Properly merge the updated data with existing website data
      const mergedWebsite = { ...website, ...updatedWebsite };
      onUpdate(mergedWebsite);
      setPublishedUrl(`https://mybiz.top/${newSlug}`);
      
      toast({
        title: "Slug Updated",
        description: `Website slug changed to: ${newSlug}`,
      });
    } catch (error) {
      console.error('Error updating slug:', error);
      toast({
        title: "Error",
        description: "Failed to update website slug",
        variant: "destructive",
      });
    }
  };

  const publishWebsite = async () => {
    setIsPublishing(true);
    
    try {
      // Ensure slug is set
      let finalSlug = website.slug;
      if (!finalSlug) {
        finalSlug = await sdk.generateUniqueSlug(website.name);
      }

      // Generate website content
      const websiteContent = await generateWebsiteContent(website);
      
      // Publish to static hosting (simulate publishing)
      await publishToStaticHost(finalSlug, websiteContent);
      
      // Update website status
      const updatedWebsite = await sdk.update('websites', website.id, {
        status: 'published',
        slug: finalSlug,
        publicUrl: `https://mybiz.top/${finalSlug}`,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Properly merge the updated data with existing website data
      const mergedWebsite = { ...website, ...updatedWebsite };
      onUpdate(mergedWebsite);
      setPublishedUrl(`https://mybiz.top/${finalSlug}`);
      
      toast({
        title: "Website Published!",
        description: `Your website is now live at mybiz.top/${finalSlug}`,
        action: (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.open(`https://mybiz.top/${finalSlug}`, '_blank')}
          >
            Visit Site
          </Button>
        ),
      });
    } catch (error) {
      console.error('Publishing error:', error);
      toast({
        title: "Publishing Failed",
        description: "There was an error publishing your website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const generateWebsiteContent = async (website: Website) => {
    // Generate HTML content for the website
    const pages = await sdk.get('pages');
    const websitePages = pages.filter(p => p.websiteId === website.id);
    
    const blogPosts = await sdk.get('blog_posts');
    const websitePosts = blogPosts.filter(p => p.websiteId === website.id);
    
    const products = await sdk.get('products');
    const websiteProducts = products.filter(p => p.websiteId === website.id);
    
    const faqs = await sdk.get('faqs');
    const websiteFaqs = faqs.filter(f => f.websiteId === website.id);

    return {
      pages: websitePages,
      blog: websitePosts,
      products: websiteProducts,
      faqs: websiteFaqs,
      theme: website.theme,
      seo: website.seoConfig,
    };
  };

  const publishToStaticHost = async (slug: string, content: any) => {
    // Simulate publishing to static hosting
    console.log(`Publishing website to: mybiz.top/${slug}`, content);
    
    // In production, this would:
    // 1. Generate static HTML files
    // 2. Upload to CDN/static hosting
    // 3. Configure routing for subdirectory
    // 4. Set up redirects and SSL
    
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publishedUrl);
    toast({
      title: "URL Copied!",
      description: "Website URL copied to clipboard",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Website Publishing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Website URL Configuration */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Website URL</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">mybiz.top/</span>
              <Input
                value={newSlug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="your-website-slug"
                className="flex-1"
              />
              {isCheckingSlug && <Loader2 className="w-4 h-4 animate-spin" />}
              {!isCheckingSlug && newSlug && newSlug !== website.slug && (
                <Button
                  onClick={updateSlug}
                  disabled={!slugAvailable}
                  size="sm"
                >
                  Update
                </Button>
              )}
            </div>
            
            {!slugAvailable && newSlug && (
              <Alert className="mt-2">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  This URL is already taken. Please choose a different one.
                </AlertDescription>
              </Alert>
            )}
            
            {slugAvailable && newSlug && newSlug !== website.slug && (
              <Alert className="mt-2">
                <Check className="w-4 h-4" />
                <AlertDescription>
                  This URL is available!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Published URL Display */}
        {website.slug && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Published URL</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="flex-1 text-sm font-mono">{publishedUrl}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(publishedUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Website Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Status</p>
            <div className="flex items-center gap-2">
              <Badge 
                variant={website.status === 'published' ? 'default' : 'secondary'}
              >
                {website.status}
              </Badge>
              {website.publishedAt && (
                <span className="text-sm text-gray-500">
                  Published {new Date(website.publishedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Publishing Actions */}
        <div className="flex items-center gap-2 pt-4">
          <Button
            onClick={publishWebsite}
            disabled={isPublishing || !slugAvailable}
            className="flex-1"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {website.status === 'published' ? 'Republish Website' : 'Publish Website'}
              </>
            )}
          </Button>
          
          {website.status === 'published' && (
            <Button
              variant="outline"
              onClick={() => window.open(publishedUrl, '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
        </div>

        {/* Publishing Info */}
        <Alert>
          <Globe className="w-4 h-4" />
          <AlertDescription>
            Your website will be published at a subdirectory URL (mybiz.top/your-slug) and will include:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>All your pages and content</li>
              <li>Blog archive at /blog</li>
              <li>Product catalog at /products</li>
              <li>FAQ section at /faq</li>
              <li>Contact forms and CRM integration</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default WebsitePublisher;
