
import React from 'react';
import { Star, Users, Phone } from 'lucide-react';

interface PublicFeaturesBlockProps {
  block: any;
}

const PublicFeaturesBlock: React.FC<PublicFeaturesBlockProps> = ({ block }) => {
  const { content } = block;
  const features = content?.features || [];
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="w-8 h-8" />;
      case 'users': return <Users className="w-8 h-8" />;
      case 'phone': return <Phone className="w-8 h-8" />;
      default: return <Star className="w-8 h-8" />;
    }
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content?.title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {content.title}
          </h2>
        )}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4 text-blue-600">
                {getIcon(feature.icon)}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublicFeaturesBlock;
