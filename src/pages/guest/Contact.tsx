
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Phone, MapPin, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Get in
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> touch</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Have questions about mybiz AI? We're here to help you succeed. 
            Reach out to our team and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Email</h4>
                      <p className="text-slate-600">hello@mybiz.ai</p>
                      <p className="text-sm text-slate-500">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Live Chat</h4>
                      <p className="text-slate-600">Available in-app</p>
                      <p className="text-sm text-slate-500">Instant support for customers</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Business Hours</h4>
                      <p className="text-slate-600">Monday - Friday</p>
                      <p className="text-sm text-slate-500">9:00 AM - 6:00 PM PST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">How quickly can I get help?</h4>
                    <p className="text-slate-600 text-sm">We respond to all inquiries within 24 hours, often much faster during business hours.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Do you offer phone support?</h4>
                    <p className="text-slate-600 text-sm">We primarily support via email and live chat for faster resolution and better documentation.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Can you help with custom requests?</h4>
                    <p className="text-slate-600 text-sm">Absolutely! We love hearing about unique use cases and custom requirements.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Need immediate help?</h3>
                <p className="mb-6 text-indigo-100">
                  Check out our comprehensive documentation and help center for instant answers.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full text-indigo-600 border-white hover:bg-white" asChild>
                    <a href="/documentation">Documentation</a>
                  </Button>
                  <Button variant="outline" className="w-full text-indigo-600 border-white hover:bg-white" asChild>
                    <a href="/help-center">Help Center</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
