
import React from 'react';
import { 
  Brain, 
  MessageSquare, 
  Palette, 
  Globe, 
  BarChart3, 
  Shield,
  Smartphone,
  Search,
  Clock
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Website Generator",
      description: "Describe your business and watch AI create a complete, professional website with pages, content, and structure.",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Prompt-Based Editing",
      description: "Edit any section by simply telling the AI what you want. No complex interfaces or technical knowledge needed.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Brand-Conscious Design",
      description: "AI creates themes and layouts that match your business personality and industry best practices.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "One-Click Publishing",
      description: "Deploy your website instantly with custom domains, SSL certificates, and global CDN included.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "SEO Optimized",
      description: "Built-in SEO analysis and optimization ensures your website ranks well in search engines.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics & Insights",
      description: "Track visitors, performance, and get AI-powered suggestions to improve your website's effectiveness.",
      gradient: "from-teal-500 to-blue-600"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Every website is automatically optimized for mobile devices and all screen sizes.",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security, automatic backups, and 99.9% uptime guarantee for your peace of mind.",
      gradient: "from-slate-500 to-gray-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Lightning Speed",
      description: "From business description to published website in under 60 seconds. The fastest way to get online.",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Powered by Advanced AI</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Everything you need to build
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> amazing websites</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform combines cutting-edge technology with intuitive design 
            to deliver professional websites that grow your business.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-900 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/50 group-hover:to-purple-50/30 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-slate-600 mb-6">
            Ready to see what AI can do for your business?
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            Start Building Your Website
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
