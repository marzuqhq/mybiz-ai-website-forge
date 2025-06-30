
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sdk from '@/lib/sdk';
import PublicPageRenderer from './PublicPageRenderer';
import { Helmet } from 'react-helmet';

interface Website {
  id: string;
  name: string;
  slug: string;
  pages: any[];
  theme: any;
  seoConfig: any;
  businessInfo: any;
}

interface PublicWebsiteViewProps {
  website: Website;
}

const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({ website }) => {
  const { pageSlug } = useParams();
  const [currentPage, setCurrentPage] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        // Get all pages for this website
        const allPages = await sdk.get('pages');
        const websitePages = allPages.filter((p: any) => p.websiteId === website.id);
        setPages(websitePages);

        // Find the current page
        const targetSlug = pageSlug || 'home';
        const page = websitePages.find((p: any) => p.slug === targetSlug) || websitePages[0];
        setCurrentPage(page);

        if (page) {
          // Get blocks for this page
          const allBlocks = await sdk.get('blocks');
          const pageBlocks = allBlocks
            .filter((b: any) => b.pageId === page.id)
            .sort((a: any, b: any) => a.order - b.order);
          setBlocks(pageBlocks);
        }
      } catch (error) {
        console.error('Error loading page content:', error);
      }
    };

    loadPageContent();
  }, [website.id, pageSlug]);

  if (!currentPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{currentPage.seoMeta?.title || currentPage.title}</title>
        <meta name="description" content={currentPage.seoMeta?.description || ''} />
        <meta name="keywords" content={currentPage.seoMeta?.keywords?.join(', ') || ''} />
        {website.seoConfig?.ogImage && <meta property="og:image" content={website.seoConfig.ogImage} />}
      </Helmet>
      
      <PublicPageRenderer 
        page={currentPage}
        blocks={blocks}
        website={website}
        allPages={pages}
      />
    </>
  );
};

export default PublicWebsiteView;
