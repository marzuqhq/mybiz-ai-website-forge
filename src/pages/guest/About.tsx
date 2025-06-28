
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, Users, Target, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-First Innovation",
      description: "We believe AI should empower creativity, not replace it. Our platform puts advanced AI capabilities in the hands of every business owner."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User-Centric Design",
      description: "Every feature is designed with real business owners in mind. We prioritize simplicity without sacrificing powerful functionality."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Accessible Technology",
      description: "Professional websites shouldn't require technical expertise. We make advanced web technology accessible to everyone."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality & Performance",
      description: "We're committed to delivering fast, secure, and SEO-optimized websites that help businesses succeed online."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">About mybiz AI</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            We're building the future of
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> website creation</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Our mission is to democratize professional web design through AI, 
            making it possible for anyone to create stunning websites without technical barriers.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Founded in 2024, mybiz AI was born from a simple observation: 
              small businesses deserve beautiful, professional websites without the complexity.
            </p>
          </div>

          <div className="prose prose-xl mx-auto text-slate-600">
            <p>
              Traditional website builders force users to choose between templates that look generic or 
              complex design tools that require extensive learning. We saw an opportunity to leverage 
              advanced AI to bridge this gap.
            </p>
            
            <p>
              Our team of AI researchers, designers, and entrepreneurs came together with a shared vision: 
              what if creating a website was as simple as describing your business? What if AI could 
              understand your needs and create something uniquely yours?
            </p>
            
            <p>
              Today, thousands of businesses trust mybiz AI to create their online presence. 
              From local restaurants to consulting firms, our platform has generated websites 
              that truly represent their unique value propositions.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Values</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Making an Impact
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              Numbers that reflect our commitment to helping businesses succeed online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Websites Created" },
              { number: "60s", label: "Average Build Time" },
              { number: "99.9%", label: "Uptime Guarantee" },
              { number: "4.9/5", label: "Customer Rating" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-indigo-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A diverse group of AI researchers, designers, and entrepreneurs passionate about 
              democratizing web design.
            </p>
          </div>

          <div className="text-center">
            <p className="text-lg text-slate-600 mb-8">
              We're a remote-first team with members across the globe, united by our mission 
              to make professional web design accessible to everyone.
            </p>
            <Link to="/careers">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Join Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to experience the future?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of businesses who've transformed their online presence with AI.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Start Building Your Website
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
