
import React from 'react';

interface PublicContentBlockProps {
  block: any;
}

const PublicContentBlock: React.FC<PublicContentBlockProps> = ({ block }) => {
  const { content } = block;
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {content?.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {content.title}
          </h2>
        )}
        {content?.content && (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {content.content}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicContentBlock;
