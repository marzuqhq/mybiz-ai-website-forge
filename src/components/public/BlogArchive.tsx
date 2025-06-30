
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Search, Tag } from 'lucide-react';
import sdk from '@/lib/sdk';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  author: string;
  tags: string[];
  category: string;
  featuredImage?: string;
}

interface BlogArchiveProps {
  websiteSlug: string;
  theme?: any;
}

const BlogArchive: React.FC<BlogArchiveProps> = ({ websiteSlug, theme }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, [websiteSlug]);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory]);

  const loadBlogPosts = async () => {
    try {
      const websites = await sdk.get('websites');
      const website = websites.find(w => w.slug === websiteSlug);
      
      if (!website) return;

      const blogPosts = await sdk.get('blog_posts');
      const websitePosts = blogPosts.filter(p => 
        p.websiteId === website.id && p.status === 'published'
      ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      setPosts(websitePosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const categories = [...new Set(posts.map(post => post.category))];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ color: theme?.primaryColor }}>
          Blog
        </h1>
        <p className="text-gray-600 text-lg">
          Discover insights, tips, and updates from our team
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            size="sm"
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts found.</p>
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getReadingTime(post.content)} min read
                    </span>
                  </div>
                </div>
                
                <CardTitle className="line-clamp-2 hover:text-blue-600 transition-colors">
                  <a href={`/${websiteSlug}/blog/${post.slug}`}>
                    {post.title}
                  </a>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <User className="w-3 h-3" />
                    {post.author || 'Admin'}
                  </div>
                  
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => window.location.href = `/${websiteSlug}/blog/${post.slug}`}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination could be added here */}
    </div>
  );
};

export default BlogArchive;
