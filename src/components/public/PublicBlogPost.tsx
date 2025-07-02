import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, ArrowLeft, Share2, Clock } from 'lucide-react';
import sdk from '@/lib/sdk';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown';

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
  seoTitle?: string;
  seoDescription?: string;
}

interface Website {
  id: string;
  name: string;
  slug: string;
  businessInfo: any;
  theme: any;
}

const PublicBlogPost: React.FC = () => {
  const { websiteSlug, postSlug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [website, setWebsite] = useState<Website | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostData();
  }, [websiteSlug, postSlug]);

  const loadPostData = async () => {
    try {
      setLoading(true);
      
      // Get website
      const websites = await sdk.get('websites');
      const currentWebsite = websites.find((w: any) => w.slug === websiteSlug);
      if (!currentWebsite) {
        throw new Error('Website not found');
      }
      setWebsite(currentWebsite);

      // Get blog post
      const allPosts = await sdk.get('blog_posts');
      const currentPost = allPosts.find((p: any) => 
        p.websiteId === currentWebsite.id && 
        p.slug === postSlug && 
        p.status === 'published'
      );
      
      if (!currentPost) {
        throw new Error('Post not found');
      }
      setPost(currentPost);

      // Get related posts
      const related = allPosts
        .filter((p: any) => 
          p.websiteId === currentWebsite.id && 
          p.id !== currentPost.id && 
          p.status === 'published' &&
          (p.category === currentPost.category || 
           p.tags.some((tag: string) => currentPost.tags.includes(tag)))
        )
        .slice(0, 3);
      setRelatedPosts(related);

    } catch (error) {
      console.error('Error loading post data:', error);
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URL copied to clipboard!');
    }
  };

  const estimateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!website || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground">The requested article could not be found.</p>
          <Button asChild className="mt-4">
            <Link to={`/${websiteSlug}/blog`}>Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title}</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        {post.featuredImage && <meta property="og:image" content={post.featuredImage} />}
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:author" content={post.author} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
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

        {/* Back to Blog */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link to={`/${website.slug}/blog`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 sm:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{post.category}</Badge>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              {post.author && (
                <div>by {post.author}</div>
              )}
              
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {estimateReadingTime(post.content)} min read
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-6">
              <p className="text-lg text-muted-foreground">
                {post.excerpt}
              </p>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Tags:</span>
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </footer>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {relatedPost.featuredImage && (
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      <Link 
                        to={`/${website.slug}/blog/${relatedPost.slug}`}
                        className="hover:text-primary"
                      >
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-secondary/20 py-12">
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

export default PublicBlogPost;