
import React from 'react';
import { MessageSquare, Brain, Globe, ArrowRight } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Describe Your Business",
      description: "Tell us about your business, target audience, and goals in natural language. No technical details needed.",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      step: "02", 
      icon: <Brain className="w-8 h-8" />,
      title: "AI Creates Your Website",
      description: "Our advanced AI analyzes your input and generates a complete website with pages, content, and design in seconds.",
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50"
    },
    {
      step: "03",
      icon: <Globe className="w-8 h-8" />,
      title: "Refine & Publish",
      description: "Make any changes with simple prompts, then publish your website with one click. Your business is now online!",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-full px-4 py-2 mb-6 shadow-sm">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Simple 3-Step Process</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            From idea to website in
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> under 60 seconds</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            No coding, no templates, no design experience required. 
            Just describe your business and watch AI do the rest.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-32 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center">
              <div className="w-1/3 h-px bg-gradient-to-r from-transparent via-indigo-300 to-indigo-300"></div>
              <div className="w-1/3 h-px bg-gradient-to-r from-indigo-300 to-indigo-300"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className={`bg-gradient-to-br ${step.bgGradient} rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-700">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {step.description}
                  </p>

                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-8">
                      <ArrowRight className="w-6 h-6 text-indigo-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Example showcase */}
        <div className="mt-20 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">See it in action</h3>
            <p className="text-slate-600">Here's what happens when you describe your business to our AI:</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Input example */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-slate-900">You say:</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 italic text-slate-700">
                "I run a local bakery called Sweet Dreams. We specialize in custom wedding cakes and artisanal pastries. 
                Our target customers are couples planning weddings and families celebrating special occasions."
              </div>
            </div>

            {/* Output example */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-slate-900">AI creates:</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-700">Homepage with hero section & gallery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-700">Wedding cakes showcase page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-700">About us with bakery story</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-700">Contact form & location info</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-700">SEO-optimized content</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg">
            Try It Free - No Credit Card Required
          </button>
          <p className="text-sm text-slate-500 mt-4">Join thousands of businesses already using mybiz AI</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
