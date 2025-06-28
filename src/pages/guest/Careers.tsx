
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Heart, Globe, Zap } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Join Our Team</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Build the future of
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> web design</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join a passionate team dedicated to democratizing professional web design through AI innovation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/contact">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                View Open Positions
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Work With Us</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're building something meaningful while creating an environment where everyone can thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Mission-Driven",
                description: "Work on technology that empowers small businesses worldwide."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Remote-First",
                description: "Work from anywhere with a globally distributed team."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Fast-Paced",
                description: "Move quickly, iterate rapidly, and see your impact immediately."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Collaborative",
                description: "Work closely with AI researchers, designers, and engineers."
              }
            ].map((value, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-white mx-auto">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to join the mission?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            We're always looking for talented people who share our vision.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-50">
              Get In Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Careers;
