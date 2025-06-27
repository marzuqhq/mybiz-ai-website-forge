
import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Bakery Owner",
      company: "Sweet Dreams Bakery",
      content: "I went from having no website to a beautiful, professional site in under 5 minutes. The AI understood exactly what I needed for my bakery business. My online orders have increased by 300%!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      name: "Michael Chen",
      role: "Consultant",
      company: "Chen Digital Strategy",
      content: "As a consultant, I needed a professional website fast. mybiz AI delivered exactly what I envisioned - clean, modern, and perfectly optimized for my target clients. The prompt-based editing is genius!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "Emily Rodriguez",
      role: "Fitness Trainer",
      company: "FitLife Personal Training",
      content: "I tried building websites before but always got stuck. With mybiz AI, I just described my fitness business and got a complete site with booking system, testimonials, and everything I needed!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      name: "David Thompson",
      role: "Restaurant Owner",
      company: "Thompson's Grill",
      content: "The AI created a website that perfectly captures our restaurant's atmosphere. The menu integration and reservation system work flawlessly. Our online presence has never been stronger.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      gradient: "from-orange-500 to-red-600"
    },
    {
      name: "Lisa Park",
      role: "Interior Designer",
      company: "Park Design Studio",
      content: "The portfolio section AI created for my interior design business is stunning. It showcases my work beautifully and the contact forms have tripled my inquiries. Absolutely worth it!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      name: "James Wilson",
      role: "Marketing Agency",
      company: "Wilson Creative",
      content: "We use mybiz AI for all our client websites now. The speed and quality are unmatched. What used to take weeks now takes minutes, and clients love the results every time.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      gradient: "from-teal-500 to-cyan-600"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Websites Created" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "< 60s", label: "Average Build Time" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-yellow-200/50 rounded-full px-4 py-2 mb-6 shadow-sm">
            <Star className="w-4 h-4 text-yellow-600 fill-current" />
            <span className="text-sm font-medium text-yellow-900">Loved by 10,000+ Businesses</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Don't take our word for it.
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> See what our customers say.</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Thousands of businesses have transformed their online presence with mybiz AI. 
            Here are some of their stories.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-700 leading-relaxed mb-8 text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover shadow-md"
                />
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-slate-600 text-sm">{testimonial.role}</div>
                  <div className="text-slate-500 text-sm">{testimonial.company}</div>
                </div>
              </div>

              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300 pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto shadow-lg border border-white/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Join thousands of successful businesses
            </h3>
            <p className="text-slate-600 mb-6 text-lg">
              Start building your AI-powered website today and see why so many businesses choose mybiz AI.
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              Start Your Success Story
            </button>
            <p className="text-sm text-slate-500 mt-4">Free to start • No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
