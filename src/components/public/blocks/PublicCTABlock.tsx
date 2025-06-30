
import React from 'react';
import { Button } from '@/components/ui/button';

interface PublicCTABlockProps {
  block: any;
}

const PublicCTABlock: React.FC<PublicCTABlockProps> = ({ block }) => {
  const { content } = block;
  
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {content?.title && (
          <h2 className="text-3xl font-bold mb-4">
            {content.title}
          </h2>
        )}
        {content?.description && (
          <p className="text-xl mb-8 text-blue-100">
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
    </section>
  );
};

export default PublicCTABlock;
