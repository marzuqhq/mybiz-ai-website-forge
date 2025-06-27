
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Wand2, 
  Globe, 
  Zap, 
  Palette, 
  Search, 
  Smartphone,
  ArrowRight,
  Check,
  Star
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description: "Simply describe your business and watch AI create a professional website in minutes."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Designs",
      description: "Modern, responsive templates automatically customized to match your brand and industry."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "SEO Optimized",
      description: "Every website comes with built-in SEO optimization to help you rank higher in search results."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile-First",
      description: "All websites are fully responsive and optimized for mobile devices and tablets."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Optimized for speed with modern web technologies and CDN delivery."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Easy Publishing",
      description: "Publish instantly with a free subdomain or connect your own custom domain."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      business: "Local Bakery",
      content: "MyBiz AI created the perfect website for my bakery in just minutes. My online orders have tripled!",
      rating: 5
    },
    {
      name: "Mike Chen",
      business: "Consulting Firm",
      content: "As a non-tech person, I was amazed how easy it was. The AI understood exactly what I needed.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      business: "Fitness Studio",
      content: "The website looks so professional, my clients think I hired an expensive agency!",
      rating: 5
    }
  ];

  const pricingFeatures = [
    "AI-powered website generation",
    "Unlimited pages and content",
    "Mobile-responsive design",
    "SEO optimization",
    "Free subdomain (yourbusiness.mybiz.app)",
    "Basic analytics",
    "Contact forms",
    "Blog functionality",
    "24/7 support"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-900 mb-8">
              <Wand2 className="w-4 h-4 mr-2" />
              AI-Powered Website Builder
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
              Your Website.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Described,
              </span>{' '}
              Not Designed.
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Tell our AI about your business and get a professional, mobile-ready website in minutes. 
              No design skills, no coding, no hassle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                See Examples
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Get online in under 5 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed Online
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI handles the technical complexity so you can focus on growing your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              From Idea to Website in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              Getting online has never been this easy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Describe Your Business</h3>
              <p className="text-gray-600">
                Tell our AI about your business type, target audience, and what makes you unique.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Creates Your Website</h3>
              <p className="text-gray-600">
                Our AI generates professional content, chooses the perfect design, and optimizes for SEO.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Publish & Go Live</h3>
              <p className="text-gray-600">
                Review, make any tweaks, and publish your website instantly with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Small Business Owners
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of entrepreneurs who've transformed their online presence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.business}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready to grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free Forever</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">$0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pricingFeatures.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button className="w-full" variant="outline">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-4">$29</div>
                <CardDescription>per month, everything you need</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pricingFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-green-600 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-gray-700">Custom domain included</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-600 mr-3" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                </ul>
                <Link to="/register" className="block mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Start Pro Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Dream Website?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of business owners who've already transformed their online presence with AI.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
              Start Building Now - It's Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-blue-200 mt-4">
            No credit card required • 14-day Pro trial included
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold">MyBiz AI</span>
              </div>
              <p className="text-gray-400">
                AI-powered website builder for small businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Features</Link></li>
                <li><Link to="/" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/" className="hover:text-white">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/" className="hover:text-white">Contact</Link></li>
                <li><Link to="/" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">About</Link></li>
                <li><Link to="/" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyBiz AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
