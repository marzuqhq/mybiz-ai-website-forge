
import React from 'react';

interface WebsitePreviewProps {
  website: any;
  pages: any[];
  currentPage: any;
  blocks: any[];
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ 
  website, 
  pages, 
  currentPage, 
  blocks 
}) => {
  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'hero':
        return (
          <section key={block.id} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {block.content.headline || 'Welcome to Our Business'}
              </h1>
              <p className="text-xl mb-8 opacity-90">
                {block.content.subheadline || 'Professional services tailored to your needs'}
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {block.content.cta || 'Get Started'}
              </button>
            </div>
          </section>
        );

      case 'services':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                {block.content.title || 'Our Services'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(block.content.services || []).map((service: any, index: number) => (
                  <div key={index} className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={block.id} className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                {block.content.title || 'About Us'}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{block.content.content || 'Learn more about our company and mission.'}</p>
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
                {block.content.title || 'Contact Us'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
                    <p className="text-gray-600 mb-4">
                      {block.content.description || 'Ready to work together? Contact us today.'}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {block.content.email && (
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">Email:</span>
                        <span className="text-blue-600">{block.content.email}</span>
                      </div>
                    )}
                    {block.content.phone && (
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">Phone:</span>
                        <span>{block.content.phone}</span>
                      </div>
                    )}
                    {block.content.address && (
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">Address:</span>
                        <span>{block.content.address}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input type="email" className="w-full p-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={block.id} className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">
                {block.content.title || 'Ready to Get Started?'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {block.content.description || 'Contact us today to learn more.'}
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {block.content.buttonText || 'Get Started'}
              </button>
            </div>
          </section>
        );

      case 'services-detail':
        return (
          <section key={block.id} className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                {block.content.title || 'Our Services'}
              </h2>
              <div className="space-y-12">
                {(block.content.services || []).map((service: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 mb-6 text-lg">{service.description}</p>
                      {service.features && (
                        <ul className="space-y-2">
                          {service.features.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Service Image</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section key={block.id} className="py-8 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-2 capitalize">{block.type} Block</h3>
                <p className="text-gray-600">Content for {block.type} section</p>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      {/* Website Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-gray-900">
              {website.name}
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              {pages.map((page) => (
                <a
                  key={page.id}
                  href={`#${page.slug}`}
                  className={`font-medium transition-colors ${
                    currentPage?.id === page.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {page.title}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Website Content */}
      <main>
        {blocks.map(renderBlock)}
      </main>

      {/* Website Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{website.name}</h3>
              <p className="text-gray-400">
                {website.businessInfo?.description || 'Professional business services'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li key={page.id}>
                    <a href={`#${page.slug}`} className="text-gray-400 hover:text-white transition-colors">
                      {page.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="text-gray-400 space-y-1">
                <div>Email: info@example.com</div>
                <div>Phone: (555) 123-4567</div>
                <div>{website.businessInfo?.location || 'Local Area'}</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 {website.name}. All rights reserved. Built with mybiz AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WebsitePreview;
