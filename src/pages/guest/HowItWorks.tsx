
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Palette, Globe, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Describe Your Business",
      description: "Tell us about your business type, target audience, location, and the services you offer. Our AI understands natural language.",
      details: ["Business type and industry", "Target audience", "Location and services", "Preferred tone and style"]
    },
    {
      step: 2,
      icon: <Brain className="w-8 h-8" />,
      title: "AI Generates Your Website",
      description: "Our advanced AI creates a complete website structure with SEO-optimized content, professional design, and all necessary pages.",
      details: ["Homepage with hero section", "About page with your story", "Services/Products pages", "Contact and FAQ sections"]
    },
    {
      step: 3,
      icon: <Palette className="w-8 h-8" />,
      title: "Customize with Prompts",
      description: "Edit any section by simply describing what you want. No design skills needed - just tell the AI your preferences.",
      details: ["Edit content with natural language", "Adjust colors and fonts", "Add or remove sections", "Optimize for your brand"]
    },
    {
      step: 4,
      icon: <Globe className="w-8 h-8" />,
      title: "Publish & Go Live",
      description: "One-click publishing with custom domain support, SSL certificates, and global CDN. Your website is ready for the world.",
      details: ["One-click publishing", "Custom domain setup", "SSL certificates included", "Global CDN for fast loading"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Simple 4-Step Process</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            From idea to website in
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> under 60 seconds</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Our AI-powered process transforms your business description into a complete, 
            professional website faster than you can imagine.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={step.step} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-slate-900">{step.title}</h2>
                  <p className="text-xl text-slate-600 leading-relaxed">{step.description}</p>
                  
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-slate-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100">
                    <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                          {step.icon}
                        </div>
                        <p className="text-slate-600 font-medium">Step {step.step} Preview</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-8">
                    <ArrowRight className="w-8 h-8 text-indigo-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            See it in action
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Watch how quickly you can go from business idea to published website
          </p>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12 mb-12">
            <div className="aspect-video bg-white rounded-xl shadow-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <p className="text-slate-600 font-medium">Interactive Demo Coming Soon</p>
              </div>
            </div>
          </div>

          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Try It Yourself - Free
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            {[
              {
                question: "How long does it really take to create a website?",
                answer: "Most websites are generated in under 60 seconds. The AI creates the structure, content, and design based on your business description instantly."
              },
              {
                question: "Can I edit the website after it's generated?",
                answer: "Absolutely! You can edit any section using natural language prompts. Just tell the AI what you want to change, and it will update the content accordingly."
              },
              {
                question: "Do I need any technical skills?",
                answer: "No technical skills required. Our platform is designed for business owners who want a professional website without learning code or design."
              },
              {
                question: "What if I don't like the generated website?",
                answer: "You can regenerate sections or the entire website with different prompts. The AI learns from your feedback to create exactly what you envision."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
