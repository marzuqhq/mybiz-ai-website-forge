
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Brain, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our AI website builder",
      icon: <Brain className="w-6 h-6" />,
      features: [
        "1 AI-generated website",
        "Basic templates and themes",
        "mybiz.app subdomain",
        "Mobile-responsive design",
        "Basic SEO optimization",
        "Community support"
      ],
      limitations: [
        "mybiz AI branding",
        "Limited customization",
        "Basic analytics"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "Best for small businesses and professionals",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Unlimited AI websites",
        "Custom domain support",
        "Advanced AI editing",
        "Remove mybiz branding",
        "Advanced SEO tools",
        "Blog and CMS features",
        "Form submissions",
        "Priority support",
        "Analytics dashboard",
        "SSL certificates included"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true
    },
    {
      name: "Business",
      price: "$99",
      period: "per month",
      description: "For growing businesses and agencies",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Everything in Pro",
        "White-label solution",
        "API access",
        "Team collaboration",
        "Advanced analytics",
        "Priority AI processing",
        "Custom integrations",
        "Dedicated support",
        "Multi-site management",
        "Advanced security features"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Simple, Transparent Pricing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Choose the perfect plan for
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> your business</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Start free and upgrade as you grow. All plans include our powerful AI website generator 
            and are backed by our 30-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  plan.popular 
                    ? 'border-indigo-200 ring-2 ring-indigo-100' 
                    : 'border-slate-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600 ml-2">/{plan.period}</span>
                  </div>

                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                    asChild
                  >
                    <Link to={plan.name === 'Business' ? '/contact' : '/register'}>
                      {plan.cta}
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 mb-3">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <h5 className="text-sm font-medium text-slate-500 mb-2">Limitations:</h5>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, i) => (
                          <li key={i} className="text-sm text-slate-500">
                            • {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Pricing FAQ
          </h2>
          
          <div className="space-y-8">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Yes! Pro plans come with a 14-day free trial. No credit card required to start, and you can cancel anytime during the trial."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely."
              },
              {
                question: "Do you offer refunds?",
                answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment in full."
              },
              {
                question: "Are there any setup fees?",
                answer: "No setup fees ever. The price you see is the price you pay. SSL certificates, hosting, and support are all included."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{faq.question}</h3>
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
            Ready to build your website?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start with our free plan and upgrade when you're ready. No credit card required.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
