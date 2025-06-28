
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Star, Award } from 'lucide-react';

const Community = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Community</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Join the
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> mybiz AI community</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Connect with thousands of business owners, share experiences, and learn from each other's success stories.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Join Discord
            </Button>
            <Link to="/register">
              <Button variant="outline" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Join Our Community?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Be part of a supportive network of entrepreneurs and business owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Get Support",
                description: "Ask questions and get help from experienced community members."
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Share Success",
                description: "Show off your websites and inspire others with your achievements."
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Learn & Grow",
                description: "Discover best practices and tips from successful business owners."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Network",
                description: "Connect with like-minded entrepreneurs and potential collaborators."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Community Stats</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of active community members worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Active Members" },
              { number: "50,000+", label: "Websites Created" },
              { number: "500+", label: "Daily Messages" },
              { number: "24/7", label: "Community Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to join the community?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Connect with fellow entrepreneurs and start building amazing websites together.
          </p>
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
            Join Discord Community
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Community;
