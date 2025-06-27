
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* AI Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8 shadow-lg">
          <Brain className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">AI-Powered Website Builder</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        {/* Main heading */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to build your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            dream website?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
          Join thousands of businesses who've transformed their online presence with AI. 
          Your perfect website is just one conversation away.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Start Building for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-white/50 hover:border-white text-white hover:text-indigo-600 hover:bg-white px-8 py-4 text-lg font-semibold rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-200"
          >
            Watch Live Demo
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">10,000+</div>
            <div className="text-blue-100">Websites Created</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">&lt; 60s</div>
            <div className="text-blue-100">Average Build Time</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-blue-100">Customer Rating</div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <p className="text-blue-200 text-lg">
            🚀 <strong>Limited Time:</strong> Start free and get your first website live in under 60 seconds
          </p>
          <p className="text-blue-300 text-sm mt-2">
            No credit card required • 14-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
