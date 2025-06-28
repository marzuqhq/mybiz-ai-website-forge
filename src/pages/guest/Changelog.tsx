
import React from 'react';
import { Calendar, Plus, Zap, Bug } from 'lucide-react';

const Changelog = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Product Updates</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            What's
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> New</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Keep up with the latest features, improvements, and fixes to mybiz AI.
          </p>
        </div>
      </section>

      {/* Changelog Entries */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {[
              {
                version: "v2.1.0",
                date: "January 15, 2024",
                type: "major",
                changes: [
                  { type: "feature", text: "New AI prompt editor with enhanced natural language processing" },
                  { type: "feature", text: "Advanced SEO optimization with real-time suggestions" },
                  { type: "improvement", text: "Faster website generation (now under 30 seconds)" },
                  { type: "improvement", text: "Enhanced mobile responsiveness across all templates" }
                ]
              },
              {
                version: "v2.0.5",
                date: "January 8, 2024",
                type: "minor",
                changes: [
                  { type: "feature", text: "Custom domain SSL certificates now auto-provision" },
                  { type: "improvement", text: "Improved AI content quality for service-based businesses" },
                  { type: "fix", text: "Fixed issue with blog post publishing" },
                  { type: "fix", text: "Resolved CMS editor formatting bugs" }
                ]
              },
              {
                version: "v2.0.0",
                date: "December 20, 2023",
                type: "major",
                changes: [
                  { type: "feature", text: "Complete platform redesign with modern UI/UX" },
                  { type: "feature", text: "New CMS with blog, FAQ, and product management" },
                  { type: "feature", text: "Advanced analytics and performance tracking" },
                  { type: "improvement", text: "Rebuilt AI engine with Gemini 2.5 Flash" },
                  { type: "improvement", text: "Enhanced security and reliability" }
                ]
              },
              {
                version: "v1.8.2",
                date: "December 5, 2023",
                type: "patch",
                changes: [
                  { type: "fix", text: "Fixed website preview loading issues" },
                  { type: "fix", text: "Resolved custom font loading problems" },
                  { type: "improvement", text: "Better error handling for AI generation failures" }
                ]
              }
            ].map((release, index) => (
              <div key={index} className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-2xl font-bold text-slate-900">{release.version}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      release.type === 'major' ? 'bg-purple-100 text-purple-800' :
                      release.type === 'minor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {release.type === 'major' ? 'Major Release' :
                       release.type === 'minor' ? 'Minor Update' : 'Patch'}
                    </span>
                  </div>
                  <span className="text-slate-600">{release.date}</span>
                </div>

                <div className="space-y-3">
                  {release.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start space-x-3">
                      <div className="mt-1">
                        {change.type === 'feature' && <Plus className="w-4 h-4 text-green-600" />}
                        {change.type === 'improvement' && <Zap className="w-4 h-4 text-blue-600" />}
                        {change.type === 'fix' && <Bug className="w-4 h-4 text-orange-600" />}
                      </div>
                      <span className="text-slate-700">{change.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay updated
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Get notified when we release new features and improvements.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Changelog;
