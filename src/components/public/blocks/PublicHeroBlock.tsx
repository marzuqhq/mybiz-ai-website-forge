
import React from 'react';
import { Button } from '@/components/ui/button';

interface PublicHeroBlockProps {
  block: any;
  website: any;
}

const PublicHeroBlock: React.FC<PublicHeroBlockProps> = ({ block, website }) => {
  const { content } = block;
  
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {content?.title || 'Welcome'}
          </h1>
          {content?.subtitle && (
            <p className="text-xl md:text-2xl mb-4 text-blue-100">
              {content.subtitle}
            </p>
          )}
          {content?.description && (
            <p className="text-lg mb-8 text-blue-50 max-w-3xl mx-auto">
              {content.description}
            </p>
          )}
          {content?.ctaText && (
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => {
                if (content.ctaLink) {
                  window.location.href = content.ctaLink;
                }
              }}
            >
              {content.ctaText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PublicHeroBlock;
