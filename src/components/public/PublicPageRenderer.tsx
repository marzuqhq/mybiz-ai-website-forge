
import React from 'react';
import PublicHeroBlock from './blocks/PublicHeroBlock';
import PublicContentBlock from './blocks/PublicContentBlock';
import PublicFeaturesBlock from './blocks/PublicFeaturesBlock';
import PublicCTABlock from './blocks/PublicCTABlock';
import PublicContactFormBlock from './blocks/PublicContactFormBlock';

interface PublicPageRendererProps {
  page: any;
  blocks: any[];
  website: any;
  allPages: any[];
}

const PublicPageRenderer: React.FC<PublicPageRendererProps> = ({ 
  page, 
  blocks, 
  website, 
  allPages 
}) => {
  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'hero':
        return <PublicHeroBlock key={block.id} block={block} website={website} />;
      case 'content':
        return <PublicContentBlock key={block.id} block={block} />;
      case 'features':
        return <PublicFeaturesBlock key={block.id} block={block} />;
      case 'cta':
        return <PublicCTABlock key={block.id} block={block} />;
      case 'contact_form':
        return <PublicContactFormBlock key={block.id} block={block} website={website} />;
      default:
        return <PublicContentBlock key={block.id} block={block} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {website.businessInfo?.name || website.name}
              </h1>
            </div>
            <div className="flex space-x-8 items-center">
              {allPages.map((navPage) => (
                <a
                  key={navPage.id}
                  href={`/${website.slug}${navPage.slug === 'home' ? '' : `/${navPage.slug}`}`}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  {navPage.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {blocks.map(renderBlock)}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">
              {website.businessInfo?.name || website.name}
            </h3>
            <p className="text-gray-400">
              {website.businessInfo?.description || 'Professional business website'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPageRenderer;
