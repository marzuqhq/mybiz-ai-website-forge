
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Code, Key, BookOpen, Zap } from 'lucide-react';

const API = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Code className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Developer API</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Build with our
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> powerful API</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Integrate AI-powered website generation into your applications with our comprehensive REST API.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Get API Key
              </Button>
            </Link>
            <Link to="/documentation">
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">API Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Everything you need to integrate AI website generation into your platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Website Generation",
                description: "Generate complete websites from business descriptions using our AI engine."
              },
              {
                icon: <Key className="w-8 h-8" />,
                title: "Secure Authentication",
                description: "API key authentication with rate limiting and usage tracking."
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Comprehensive Docs",
                description: "Detailed documentation with code examples and SDKs."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to start building?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Get your API key and start integrating AI website generation today.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default API;
