
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Zap, Users } from 'lucide-react';

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Documentation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Everything you need to
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> get started</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Comprehensive guides, API references, and tutorials to help you make the most of mybiz AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
            <Link to="/api">
              <Button variant="outline" size="lg">
                API Reference
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Documentation</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Find the information you need to build amazing websites with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Quick Start Guide",
                description: "Get up and running with your first AI-generated website in minutes.",
                topics: ["Account Setup", "First Website", "Publishing", "Custom Domains"]
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: "API Reference",
                description: "Complete API documentation with examples and SDKs.",
                topics: ["Authentication", "Website Generation", "Content Management", "Webhooks"]
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "User Guides",
                description: "Detailed tutorials for all platform features and capabilities.",
                topics: ["Prompt Engineering", "CMS Management", "SEO Optimization", "Analytics"]
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Best Practices",
                description: "Tips and strategies for creating effective business websites.",
                topics: ["Content Strategy", "Design Principles", "Conversion Optimization", "Performance"]
              }
            ].map((section, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{section.title}</h3>
                <p className="text-slate-600 mb-6">{section.description}</p>
                <ul className="space-y-2 mb-6">
                  {section.topics.map((topic, i) => (
                    <li key={i} className="text-sm text-slate-600">• {topic}</li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Read Documentation
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our support team is here to help you succeed.
          </p>
          <Link to="/help-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Get Help
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Documentation;
