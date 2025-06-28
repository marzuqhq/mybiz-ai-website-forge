
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle, BookOpen, Mail } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Help Center</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            We're here to
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> help you succeed</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Find answers to common questions, get support, and learn how to make the most of mybiz AI.
          </p>
        </div>
      </section>

      {/* Help Options */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">How can we help?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the best way to get the support you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Documentation",
                description: "Comprehensive guides and tutorials for all features.",
                action: "Browse Docs",
                link: "/documentation"
              },
              {
                icon: <MessageCircle className="w-8 h-8" />,
                title: "Community",
                description: "Connect with other users and share experiences.",
                action: "Join Community",
                link: "/community"
              },
              {
                icon: <Mail className="w-8 h-8" />,
                title: "Email Support",
                description: "Get personalized help from our support team.",
                action: "Contact Support",
                link: "/contact"
              },
              {
                icon: <HelpCircle className="w-8 h-8" />,
                title: "FAQ",
                description: "Quick answers to the most common questions.",
                action: "View FAQ",
                link: "#faq"
              }
            ].map((option, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{option.title}</h3>
                <p className="text-slate-600 mb-6">{option.description}</p>
                <Link to={option.link}>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    {option.action}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">
              Quick answers to common questions about mybiz AI.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly can I create a website?",
                answer: "With mybiz AI, you can generate a complete website in under 60 seconds. Simply describe your business, and our AI will create pages, content, and structure automatically."
              },
              {
                question: "Can I customize the generated website?",
                answer: "Absolutely! You can edit any section using natural language prompts. Just tell the AI what you want to change, and it will update the content accordingly."
              },
              {
                question: "Do I need technical skills to use mybiz AI?",
                answer: "No technical skills required. Our platform is designed for business owners who want professional websites without learning complex tools or coding."
              },
              {
                question: "Can I use my own domain name?",
                answer: "Yes, you can connect your custom domain to any website created with mybiz AI. We provide step-by-step instructions for domain setup."
              },
              {
                question: "What kind of websites can I create?",
                answer: "mybiz AI can create various types of business websites including service businesses, restaurants, consultants, agencies, and more. The AI adapts to your specific industry."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still need help?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our support team is here to help you succeed with your website.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
