
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, MessageSquare, Palette, Globe, Search, BarChart3, Smartphone, Shield, Clock, Zap, Users, Code } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Website Generator",
      description: "Describe your business and watch AI create a complete, professional website with pages, content, and structure.",
      category: "AI Core"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Prompt-Based Editing",
      description: "Edit any section by simply telling the AI what you want. No complex interfaces or technical knowledge needed.",
      category: "AI Core"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Brand-Conscious Design",
      description: "AI creates themes and layouts that match your business personality and industry best practices.",
      category: "Design"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "One-Click Publishing",
      description: "Deploy your website instantly with custom domains, SSL certificates, and global CDN included.",
      category: "Deployment"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "SEO Optimized",
      description: "Built-in SEO analysis and optimization ensures your website ranks well in search engines.",
      category: "Marketing"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Track visitors, performance, and get AI-powered suggestions to improve your website's effectiveness.",
      category: "Analytics"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Every website is automatically optimized for mobile devices and all screen sizes.",
      category: "Design"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security, automatic backups, and 99.9% uptime guarantee for your peace of mind.",
      category: "Security"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Lightning Speed",
      description: "From business description to published website in under 60 seconds. The fastest way to get online.",
      category: "Performance"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart CMS",
      description: "Manage blog posts, FAQs, and products with AI assistance for content creation and optimization.",
      category: "Content"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-User Support",
      description: "Collaborate with team members and clients with role-based access control and editing permissions.",
      category: "Collaboration"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Developer API",
      description: "Integrate with your existing tools and workflows using our comprehensive REST API.",
      category: "Developer"
    }
  ];

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">AI-Powered Features</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Everything you need to build
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> amazing websites</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Our AI-powered platform combines cutting-edge technology with intuitive design 
            to deliver professional websites that grow your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Start Building for Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {categories.map((category) => (
            <div key={category} className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.filter(f => f.category === category).map((feature, index) => (
                  <div 
                    key={index}
                    className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-900 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to experience the future of website building?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of businesses who've transformed their online presence with AI.
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

export default Features;
