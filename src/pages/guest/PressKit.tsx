
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Image, FileText, Users } from 'lucide-react';

const PressKit = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Press Kit</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Media &
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Press Resources</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Everything you need to write about mybiz AI, including logos, screenshots, and company information.
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Download Resources</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              High-quality assets for journalists, bloggers, and media partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Image className="w-8 h-8" />,
                title: "Brand Assets",
                description: "Logos, icons, and brand guidelines in various formats.",
                items: ["Logo Pack (PNG, SVG)", "Brand Colors", "Typography Guide"]
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Company Info",
                description: "Fact sheets, bios, and company background information.",
                items: ["Company Fact Sheet", "Founder Bios", "Product Overview"]
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Screenshots",
                description: "High-resolution product screenshots and demo videos.",
                items: ["Platform Screenshots", "Demo Videos", "User Interface"]
              }
            ].map((resource, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{resource.title}</h3>
                <p className="text-slate-600 mb-6">{resource.description}</p>
                <ul className="space-y-2 mb-6">
                  {resource.items.map((item, i) => (
                    <li key={i} className="text-sm text-slate-600">• {item}</li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Need more information?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Contact our media team for interviews, quotes, or additional resources.
          </p>
          <div className="text-white">
            <p className="text-lg mb-2">Press Contact: press@mybiz.ai</p>
            <p className="text-indigo-100">Response within 24 hours</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PressKit;
