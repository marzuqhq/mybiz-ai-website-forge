
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Palette, Eye, Zap } from 'lucide-react';

const Templates = () => {
  const templateCategories = [
    {
      name: "Business Services",
      description: "Professional templates for consulting, agencies, and service providers",
      templates: ["Consulting Firm", "Marketing Agency", "Legal Services", "Accounting Firm"]
    },
    {
      name: "E-commerce",
      description: "Beautiful online stores and product showcases",
      templates: ["Fashion Store", "Electronics Shop", "Handmade Crafts", "Digital Products"]
    },
    {
      name: "Restaurants & Food",
      description: "Appetizing designs for restaurants, cafes, and food businesses",
      templates: ["Fine Dining", "Casual Restaurant", "Food Truck", "Bakery & Cafe"]
    },
    {
      name: "Health & Wellness",
      description: "Clean, professional designs for healthcare and wellness",
      templates: ["Medical Practice", "Dental Clinic", "Fitness Studio", "Spa & Wellness"]
    },
    {
      name: "Creative & Arts",
      description: "Stunning portfolios and creative showcases",
      templates: ["Photography", "Design Portfolio", "Art Gallery", "Music & Events"]
    },
    {
      name: "Technology",
      description: "Modern designs for tech companies and startups",
      templates: ["SaaS Platform", "Tech Startup", "App Landing", "Software Company"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Palette className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">AI-Generated Templates</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Beautiful templates, powered by
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> AI creativity</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Unlike traditional templates, our AI creates unique designs tailored to your specific business. 
            Every website is one-of-a-kind, never generic.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Start Creating Your Website
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Difference Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Why AI Templates Are Better
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Traditional templates are rigid and generic. Our AI creates custom designs that truly represent your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Uniquely Yours</h3>
              <p className="text-slate-600 leading-relaxed">
                Every design is generated specifically for your business description. No two websites look the same.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Industry-Aware</h3>
              <p className="text-slate-600 leading-relaxed">
                AI understands your industry and creates appropriate layouts, colors, and content structures.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Instantly Customizable</h3>
              <p className="text-slate-600 leading-relaxed">
                Change any element with simple prompts. No design skills or complex editors required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Categories */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Designs for Every Industry
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI understands different industries and creates appropriate designs that resonate with your target audience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templateCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{category.name}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{category.description}</p>
                
                <div className="space-y-2 mb-6">
                  {category.templates.map((template, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span className="text-slate-700 text-sm">{template}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white">
                      <Palette className="w-6 h-6" />
                    </div>
                    <p className="text-slate-600 text-sm">AI-Generated Preview</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            How AI Templates Work
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Unlike choosing from pre-made templates, our AI creates a unique design just for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Describe Your Business</h3>
              <p className="text-slate-600 text-sm">Tell us about your industry, style preferences, and target audience.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI Creates Your Design</h3>
              <p className="text-slate-600 text-sm">Our AI generates a unique layout, color scheme, and content structure.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Customize & Publish</h3>
              <p className="text-slate-600 text-sm">Edit with prompts and publish your unique website in minutes.</p>
            </div>
          </div>

          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Create Your Unique Website
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for a truly unique website?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Stop settling for generic templates. Let AI create something uniquely yours.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Start Building Your Website
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Templates;
