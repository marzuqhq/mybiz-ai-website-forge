
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sdk from '@/lib/sdk';
import PublicWebsiteView from './PublicWebsiteView';
import { Loader2 } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  slug: string;
  status: string;
  pages: any[];
  theme: any;
  seoConfig: any;
  businessInfo: any;
}

const PublicWebsiteRouter: React.FC = () => {
  const { websiteSlug } = useParams();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWebsite = async () => {
      if (!websiteSlug) {
        setError('No website slug provided');
        setLoading(false);
        return;
      }

      try {
        const websites = await sdk.get('websites');
        const foundWebsite = websites.find((w: any) => w.slug === websiteSlug && w.status === 'published');
        
        if (!foundWebsite) {
          setError('Website not found or not published');
          setLoading(false);
          return;
        }

        setWebsite(foundWebsite);
      } catch (error) {
        console.error('Error loading website:', error);
        setError('Failed to load website');
      } finally {
        setLoading(false);
      }
    };

    loadWebsite();
  }, [websiteSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Website Not Found</h1>
          <p className="text-gray-600">{error || 'The requested website could not be found.'}</p>
        </div>
      </div>
    );
  }

  return <PublicWebsiteView website={website} />;
};

export default PublicWebsiteRouter;
