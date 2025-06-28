
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
  const featuredPost = {
    title: "The Future of AI-Powered Web Design: What Small Businesses Need to Know",
    excerpt: "Discover how artificial intelligence is revolutionizing website creation and why traditional web design is becoming obsolete for small businesses.",
    author: "mybiz AI Team",
    date: "January 15, 2024",
    readTime: "5 min read",
    tags: ["AI", "Web Design", "Small Business"],
    image: "/api/placeholder/800/400"
  };

  const blogPosts = [
    {
      title: "10 AI Prompts That Will Transform Your Website Content",
      excerpt: "Learn the exact prompts successful business owners use to create compelling website content with AI.",
      author: "Sarah Johnson",
      date: "January 12, 2024",
      readTime: "4 min read",
      tags: ["AI Prompts", "Content"],
      category: "Tips & Tricks"
    },
    {
      title: "Why Your Small Business Needs a Website in 2024",
      excerpt: "Statistics show that 75% of consumers judge a business's credibility based on their website. Here's why you can't afford to wait.",
      author: "Mike Chen",
      date: "January 10, 2024",
      readTime: "6 min read",
      tags: ["Business", "Marketing"],
      category: "Business Growth"
    },
    {
      title: "From Idea to Published: A Complete Website Creation Journey",
      excerpt: "Follow along as we create a complete website for a local bakery using only AI prompts and natural language.",
      author: "Emily Rodriguez",
      date: "January 8, 2024",
      readTime: "8 min read",
      tags: ["Case Study", "Tutorial"],
      category: "Case Studies"
    },
    {
      title: "SEO in the Age of AI: How to Rank Higher Effortlessly",
      excerpt: "Discover how AI can automatically optimize your website for search engines without technical knowledge.",
      author: "David Park",
      date: "January 5, 2024",
      readTime: "5 min read",
      tags: ["SEO", "AI", "Marketing"],
      category: "SEO & Marketing"
    },
    {
      title: "The Psychology of AI-Generated Design: Why It Works",
      excerpt: "Explore the science behind why AI-generated websites convert better than traditional templates.",
      author: "Dr. Lisa Wong",
      date: "January 3, 2024",
      readTime: "7 min read",
      tags: ["Psychology", "Design", "Conversion"],
      category: "Design & Psychology"
    }
  ];

  const categories = ["All", "Tips & Tricks", "Business Growth", "Case Studies", "SEO & Marketing", "Design & Psychology"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Learn, grow, and succeed with
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> AI-powered insights</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover the latest trends in AI web design, practical tips for growing your business online, 
            and success stories from entrepreneurs like you.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Featured Article</h2>
          
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                      <ArrowRight className="w-8 h-8" />
                    </div>
                    <p className="text-slate-600 font-medium">Featured Article</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button 
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Recent Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 text-white">
                      <Tag className="w-6 h-6" />
                    </div>
                    <p className="text-slate-600 text-sm font-medium">{post.category}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-tight hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stay updated with the latest insights
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Get weekly articles about AI, web design, and growing your business delivered to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-50 px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
