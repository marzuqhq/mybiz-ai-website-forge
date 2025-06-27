
import React from 'react';

interface Website {
  id: string;
  name: string;
  theme: any;
  businessInfo: any;
  seoConfig: any;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  type: string;
  seoMeta: any;
}

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
  aiGenerated: boolean;
}

interface WebsitePreviewProps {
  website: Website;
  pages: Page[];
  currentPage: Page;
  blocks: Block[];
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  website,
  pages,
  currentPage,
  blocks
}) => {
  const theme = website.theme || {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    fontFamily: 'Inter'
  };

  const renderBlock = (block: Block) => {
    const { type, content } = block;

    switch (type) {
      case 'hero':
        return (
          <section key={block.id} className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <h1 className="text-5xl font-bold mb-6">{content.headline}</h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">{content.subheadline}</p>
              <button 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                style={{ color: theme.primaryColor }}
              >
                {content.ctaText}
              </button>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">{content.description}</p>
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section key={block.id} className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.services?.map((service: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={block.id} className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
              <p className="text-lg mb-8">{content.description}</p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                {content.ctaText}
              </button>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title || 'Contact Us'}</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <div className="space-y-4">
                    {content.phone && (
                      <p className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Phone:</span>
                        {content.phone}
                      </p>
                    )}
                    {content.email && (
                      <p className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Email:</span>
                        {content.email}
                      </p>
                    )}
                    {content.address && (
                      <p className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Address:</span>
                        {content.address}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section key={block.id} className="py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 capitalize">{type} Section</h3>
                <p className="text-gray-600">
                  {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                </p>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: theme.primaryColor }}
              >
                AI
              </div>
              <span className="text-xl font-bold text-gray-900">{website.name}</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {pages.map((page) => (
                <a
                  key={page.id}
                  href={`#${page.slug}`}
                  className={`text-gray-600 hover:text-gray-900 transition-colors ${
                    currentPage.id === page.id ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {page.title}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main>
        {blocks.map(renderBlock)}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: theme.primaryColor }}
              >
                AI
              </div>
              <span className="text-xl font-bold">{website.name}</span>
            </div>
            <p className="text-gray-400">
              {website.businessInfo?.description || 'Powered by MyBiz AI'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsitePreview;
