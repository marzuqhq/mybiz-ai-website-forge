
import React from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out mybiz AI",
      features: [
        "1 website",
        "AI website generation",
        "Basic templates",
        "mybiz.app subdomain",
        "Community support",
        "Basic analytics"
      ],
      limitations: [
        "Limited customization",
        "mybiz branding"
      ],
      cta: "Get Started Free",
      popular: false,
      gradient: "from-slate-500 to-gray-600"
    },
    {
      name: "Professional",
      price: "$19",
      period: "/month",
      description: "For serious businesses ready to scale",
      features: [
        "5 websites",
        "Advanced AI editing",
        "Custom domain",
        "Remove mybiz branding",
        "Advanced analytics",
        "SEO optimization",
        "Email support",
        "Custom themes",
        "Blog & CMS",
        "Form submissions"
      ],
      cta: "Start Free Trial",
      popular: true,
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      name: "Business",
      price: "$49",
      period: "/month",
      description: "For agencies and growing businesses",
      features: [
        "Unlimited websites",
        "White-label solution",
        "Priority support",
        "Advanced integrations",
        "Team collaboration",
        "Custom AI training",
        "API access",
        "Advanced analytics",
        "A/B testing",
        "Premium themes"
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full px-4 py-2 mb-6 border border-indigo-200/50">
            <Star className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Simple, Transparent Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Choose the perfect plan
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> for your business</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. All plans include our core AI features 
            and 14-day money-back guarantee.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-3xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                plan.popular 
                  ? 'border-indigo-200 ring-4 ring-indigo-100' 
                  : 'border-slate-200 hover:border-indigo-200'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-600">{plan.period}</span>}
                </div>
                <p className="text-slate-600">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations && plan.limitations.map((limitation, limitIndex) => (
                    <li key={`limit-${limitIndex}`} className="flex items-start space-x-3 opacity-60">
                      <div className="w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-600 line-through">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link to="/register" className="block">
                <Button 
                  className={`w-full py-3 font-semibold rounded-xl transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {plan.cta}
                  {plan.popular && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </Link>

              {/* Trial note */}
              {plan.popular && (
                <p className="text-center text-sm text-slate-500 mt-4">
                  14-day free trial • No credit card required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Need a custom solution?
            </h3>
            <p className="text-slate-600 mb-6 text-lg">
              We work with enterprises and agencies to create custom AI solutions 
              tailored to your specific needs and workflows.
            </p>
            <Button 
              variant="outline"
              className="border-2 border-indigo-300 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 px-8 py-3 rounded-xl bg-white/80 backdrop-blur-sm"
            >
              Contact Enterprise Sales
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* FAQ link */}
          <div className="mt-12">
            <p className="text-slate-600">
              Have questions about our pricing? 
              <a href="#faq" className="text-indigo-600 hover:text-indigo-700 font-semibold ml-1">
                Check our FAQ
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
