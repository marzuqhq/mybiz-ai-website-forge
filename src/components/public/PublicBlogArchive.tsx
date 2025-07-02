import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Search, Tag, ArrowRight } from 'lucide-react';
import sdk from '@/lib/sdk';
import { Helmet } from 'react-helmet';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  category: string;
  author: string;
  featuredImage?: string;
}

interface Website {
  id: string;
  name: string;
  slug: string;
  businessInfo: any;
  theme: any;
}

const PublicBlogArchive: React.FC = () => {
  const { websiteSlug } = useParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadBlogData();
  }, [websiteSlug]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      
      // Get website
      const websites = await sdk.get('websites');
      const currentWebsite = websites.find((w: any) => w.slug === websiteSlug);
      if (!currentWebsite) {
        throw new Error('Website not found');
      }
      setWebsite(currentWebsite);

      // Get blog posts
      const allPosts = await sdk.get('blog_posts');
      const websitePosts = allPosts
        .filter((post: any) => post.websiteId === currentWebsite.id && post.status === 'published')
        .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      
      setPosts(websitePosts);
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(posts.map(post => post.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Website Not Found</h1>
          <p className="text-muted-foreground">The requested website could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Blog - ${website.businessInfo?.name || website.name}`}</title>
        <meta name="description" content={`Read the latest articles and insights from ${website.businessInfo?.name || website.name}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={`/${website.slug}`} className="text-xl font-bold text-foreground">
                {website.businessInfo?.name || website.name}
              </Link>
              <nav className="flex items-center space-x-6">
                <Link to={`/${website.slug}`} className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <Link to={`/${website.slug}/blog`} className="text-foreground font-medium">
                  Blog
                </Link>
                <Link to={`/${website.slug}/contact`} className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, tips, and stories from {website.businessInfo?.name || website.name}
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('')}
                size="sm"
              >
                All Categories
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
              <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No blog posts have been published yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                      {post.author && (
                        <span className="ml-2">by {post.author}</span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link
                        to={`/${website.slug}/blog/${post.slug}`}
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm"
                      >
                        Read more
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-secondary/20 mt-16 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-lg font-semibold mb-4">
              {website.businessInfo?.name || website.name}
            </h3>
            <p className="text-muted-foreground">
              {website.businessInfo?.description || 'Professional business website'}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PublicBlogArchive;