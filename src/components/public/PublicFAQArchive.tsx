import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, MessageCircle } from 'lucide-react';
import sdk from '@/lib/sdk';
import { Helmet } from 'react-helmet';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: string;
  order: number;
  tags: string[];
}

interface Website {
  id: string;
  name: string;
  slug: string;
  businessInfo: any;
  theme: any;
}

const PublicFAQArchive: React.FC = () => {
  const { websiteSlug } = useParams();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadFAQData();
  }, [websiteSlug]);

  const loadFAQData = async () => {
    try {
      setLoading(true);
      
      // Get website
      const websites = await sdk.get('websites');
      const currentWebsite = websites.find((w: any) => w.slug === websiteSlug);
      if (!currentWebsite) {
        throw new Error('Website not found');
      }
      setWebsite(currentWebsite);

      // Get FAQs
      const allFaqs = await sdk.get('faqs');
      const websiteFaqs = allFaqs
        .filter((faq: any) => faq.websiteId === currentWebsite.id && faq.status === 'published')
        .sort((a: any, b: any) => a.order - b.order);
      
      setFaqs(websiteFaqs);
    } catch (error) {
      console.error('Error loading FAQ data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(faqs.map(faq => faq.category))];
  const groupedFaqs = categories.reduce((acc, category) => {
    acc[category] = filteredFaqs.filter(faq => faq.category === category);
    return acc;
  }, {} as Record<string, FAQ[]>);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading FAQs...</p>
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
        <title>{`FAQ - ${website.businessInfo?.name || website.name}`}</title>
        <meta name="description" content={`Frequently asked questions about ${website.businessInfo?.name || website.name}`} />
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
                <Link to={`/${website.slug}/products`} className="text-muted-foreground hover:text-foreground">
                  Products
                </Link>
                <Link to={`/${website.slug}/blog`} className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
                <Link to={`/${website.slug}/faq`} className="text-foreground font-medium">
                  FAQ
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
            <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our products and services
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
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

          {/* FAQ Content */}
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">No FAQs found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No FAQs are currently available.'}
              </p>
            </div>
          ) : selectedCategory === 'all' ? (
            // Show by categories when viewing all
            <div className="space-y-8">
              {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                categoryFaqs.length > 0 && (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="secondary">{category}</Badge>
                        <span className="text-lg">{category} Questions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {categoryFaqs.map((faq, index) => (
                          <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                            <AccordionTrigger className="text-left hover:no-underline">
                              <div className="flex items-start gap-3">
                                <MessageCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                                <span>{faq.question}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="ml-8">
                              <div className="prose prose-sm max-w-none">
                                <p>{faq.answer}</p>
                              </div>
                              {faq.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                                  {faq.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          ) : (
            // Show filtered results in a single accordion
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedCategory}</Badge>
                  <span className="text-lg">
                    {filteredFaqs.length} Question{filteredFaqs.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-start gap-3">
                          <MessageCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="ml-8">
                        <div className="prose prose-sm max-w-none">
                          <p>{faq.answer}</p>
                        </div>
                        {faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}

          {/* Contact Section */}
          <Card className="mt-12">
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Didn't find what you're looking for?</h3>
              <p className="text-muted-foreground mb-4">
                Our team is here to help you with any questions you might have.
              </p>
              <Button asChild>
                <Link to={`/${website.slug}/contact`}>
                  Contact Us
                </Link>
              </Button>
            </CardContent>
          </Card>
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

export default PublicFAQArchive;