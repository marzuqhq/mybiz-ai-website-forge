
import sdk from './enhanced-sdk';

interface GeneratePageRequest {
  websiteId: string;
  pageType: string;
  businessInfo: any;
  prompt: string;
  theme: any;
}

interface PageBlock {
  type: string;
  content: any;
  order: number;
}

class AIPageGenerator {
  async generatePage(request: GeneratePageRequest): Promise<any> {
    try {
      console.log('🤖 Generating page with AI...', request);
      
      // Get existing content for context
      const existingPages = await sdk.get('pages');
      const websitePages = existingPages.filter((p: any) => p.websiteId === request.websiteId);
      
      const existingBlocks = await sdk.get('blocks');
      const websiteBlocks = existingBlocks.filter((b: any) => 
        websitePages.some((p: any) => p.id === b.pageId)
      );

      // Generate page content based on type and prompt
      const pageContent = await this.generatePageContent(request, websitePages, websiteBlocks);
      
      // Create the page
      const newPage = await sdk.insert('pages', {
        websiteId: request.websiteId,
        title: pageContent.title,
        slug: pageContent.slug,
        type: request.pageType,
        seoMeta: {
          title: pageContent.title,
          description: pageContent.description,
          keywords: pageContent.keywords
        },
        status: 'published'
      });

      // Create blocks for the page
      const blocks = [];
      for (let i = 0; i < pageContent.blocks.length; i++) {
        const blockData = pageContent.blocks[i];
        const block = await sdk.insert('blocks', {
          pageId: newPage.id,
          type: blockData.type,
          content: blockData.content,
          order: i,
          aiGenerated: true,
          editable: true
        });
        blocks.push(block);
      }

      return {
        page: newPage,
        blocks: blocks
      };
    } catch (error) {
      console.error('Error generating page:', error);
      throw error;
    }
  }

  private async generatePageContent(request: GeneratePageRequest, existingPages: any[], existingBlocks: any[]): Promise<any> {
    // Get business context
    const website = await sdk.getItem('websites', request.websiteId);
    if (!website) {
      throw new Error('Website not found');
    }

    // Get related content for context
    const blogPosts = await sdk.get('blog_posts');
    const websitePosts = blogPosts.filter((p: any) => p.websiteId === request.websiteId);
    
    const products = await sdk.get('products');
    const websiteProducts = products.filter((p: any) => p.websiteId === request.websiteId);
    
    const faqs = await sdk.get('faqs');
    const websiteFaqs = faqs.filter((f: any) => f.websiteId === request.websiteId);

    // Generate content based on page type
    switch (request.pageType) {
      case 'homepage':
        return this.generateHomepageContent(request, website, websiteProducts);
      case 'about':
        return this.generateAboutContent(request, website);
      case 'services':
        return this.generateServicesContent(request, website, websiteProducts);
      case 'contact':
        return this.generateContactContent(request, website);
      case 'blog':
        return this.generateBlogContent(request, website, websitePosts);
      case 'products':
        return this.generateProductsContent(request, website, websiteProducts);
      default:
        return this.generateGenericContent(request, website);
    }
  }

  private generateHomepageContent(request: GeneratePageRequest, website: any, products: any[]): any {
    const businessName = website.businessInfo?.name || 'Our Business';
    const industry = website.businessInfo?.industry || 'Business';
    
    return {
      title: `${businessName} - ${industry} Solutions`,
      slug: 'home',
      description: `Welcome to ${businessName}. We provide quality ${industry} solutions for your needs.`,
      keywords: [businessName.toLowerCase(), industry.toLowerCase(), 'solutions', 'services'],
      blocks: [
        {
          type: 'hero',
          content: {
            title: `Welcome to ${businessName}`,
            subtitle: `Your trusted partner for ${industry} solutions`,
            description: request.prompt || `We provide exceptional ${industry} services tailored to your needs.`,
            ctaText: 'Get Started',
            ctaLink: '/contact',
            backgroundImage: '/placeholder.svg',
            theme: request.theme
          }
        },
        {
          type: 'features',
          content: {
            title: 'Why Choose Us',
            features: [
              {
                title: 'Expert Team',
                description: 'Our experienced professionals deliver quality results',
                icon: 'users'
              },
              {
                title: 'Quality Service',
                description: 'We maintain the highest standards in everything we do',
                icon: 'star'
              },
              {
                title: '24/7 Support',
                description: 'Round-the-clock assistance whenever you need it',
                icon: 'phone'
              }
            ]
          }
        },
        ...(products.length > 0 ? [{
          type: 'products',
          content: {
            title: 'Our Products',
            products: products.slice(0, 3),
            viewAllLink: '/products'
          }
        }] : []),
        {
          type: 'cta',
          content: {
            title: 'Ready to Get Started?',
            description: 'Contact us today to learn more about our services',
            ctaText: 'Contact Us',
            ctaLink: '/contact'
          }
        }
      ]
    };
  }

  private generateAboutContent(request: GeneratePageRequest, website: any): any {
    const businessName = website.businessInfo?.name || 'Our Company';
    
    return {
      title: `About ${businessName}`,
      slug: 'about',
      description: `Learn more about ${businessName} and our mission to provide excellent services.`,
      keywords: ['about', businessName.toLowerCase(), 'company', 'mission'],
      blocks: [
        {
          type: 'hero',
          content: {
            title: `About ${businessName}`,
            subtitle: 'Our Story and Mission',
            description: request.prompt || `Discover how ${businessName} started and what drives us forward.`
          }
        },
        {
          type: 'content',
          content: {
            title: 'Our Story',
            content: `${businessName} was founded with a simple mission: to provide exceptional services that make a difference. Over the years, we have grown from a small startup to a trusted partner for businesses and individuals alike.`
          }
        },
        {
          type: 'team',
          content: {
            title: 'Meet Our Team',
            members: [
              {
                name: 'John Doe',
                position: 'CEO & Founder',
                image: '/placeholder.svg',
                bio: 'Leading our vision with passion and dedication.'
              },
              {
                name: 'Jane Smith',
                position: 'CTO',
                image: '/placeholder.svg',
                bio: 'Driving innovation and technical excellence.'
              }
            ]
          }
        }
      ]
    };
  }

  private generateServicesContent(request: GeneratePageRequest, website: any, products: any[]): any {
    const businessName = website.businessInfo?.name || 'Our Company';
    
    return {
      title: `Services - ${businessName}`,
      slug: 'services',
      description: `Explore our comprehensive range of services at ${businessName}.`,
      keywords: ['services', businessName.toLowerCase(), 'solutions'],
      blocks: [
        {
          type: 'hero',
          content: {
            title: 'Our Services',
            subtitle: 'Comprehensive Solutions for Your Needs',
            description: request.prompt || 'We offer a wide range of services designed to help you succeed.'
          }
        },
        {
          type: 'services',
          content: {
            title: 'What We Offer',
            services: products.length > 0 ? products.map((p: any) => ({
              title: p.name,
              description: p.description,
              features: p.features || [],
              price: p.price
            })) : [
              {
                title: 'Consulting',
                description: 'Expert advice and guidance for your business',
                features: ['Strategic Planning', 'Market Analysis', 'Risk Assessment']
              },
              {
                title: 'Implementation',
                description: 'Professional implementation of solutions',
                features: ['Project Management', 'Quality Assurance', 'Training']
              },
              {
                title: 'Support',
                description: 'Ongoing support and maintenance',
                features: ['24/7 Support', 'Regular Updates', 'Troubleshooting']
              }
            ]
          }
        }
      ]
    };
  }

  private generateContactContent(request: GeneratePageRequest, website: any): any {
    const businessName = website.businessInfo?.name || 'Our Company';
    
    return {
      title: `Contact ${businessName}`,
      slug: 'contact',
      description: `Get in touch with ${businessName}. We're here to help with your needs.`,
      keywords: ['contact', businessName.toLowerCase(), 'get in touch'],
      blocks: [
        {
          type: 'hero',
          content: {
            title: 'Contact Us',
            subtitle: 'Get in Touch',
            description: request.prompt || "We'd love to hear from you. Send us a message and we'll respond as soon as possible."
          }
        },
        {
          type: 'contact_form',
          content: {
            title: 'Send us a Message',
            fields: [
              { name: 'name', label: 'Your Name', type: 'text', required: true },
              { name: 'email', label: 'Email Address', type: 'email', required: true },
              { name: 'subject', label: 'Subject', type: 'text', required: true },
              { name: 'message', label: 'Message', type: 'textarea', required: true }
            ]
          }
        },
        {
          type: 'contact_info',
          content: {
            title: 'Contact Information',
            info: [
              { label: 'Email', value: website.businessInfo?.email || 'info@company.com' },
              { label: 'Phone', value: website.businessInfo?.phone || '+1 (555) 123-4567' },
              { label: 'Address', value: website.businessInfo?.address || '123 Business St, City, State 12345' }
            ]
          }
        }
      ]
    };
  }

  private generateBlogContent(request: GeneratePageRequest, website: any, posts: any[]): any {
    const businessName = website.businessInfo?.name || 'Our Company';
    
    return {
      title: `Blog - ${businessName}`,
      slug: 'blog',
      description: `Read the latest articles and insights from ${businessName}.`,
      keywords: ['blog', 'articles', 'insights', businessName.toLowerCase()],
      blocks: [
        {
          type: 'hero',
          content: {
            title: 'Our Blog',
            subtitle: 'Latest Articles and Insights',
            description: request.prompt || 'Stay updated with our latest thoughts, tips, and industry insights.'
          }
        },
        {
          type: 'blog_posts',
          content: {
            title: 'Recent Posts',
            posts: posts.slice(0, 6),
            viewAllLink: '/blog'
          }
        }
      ]
    };
  }

  private generateProductsContent(request: GeneratePageRequest, website: any, products: any[]): any {
    const businessName = website.businessInfo?.name || 'Our Company';
    
    return {
      title: `Products - ${businessName}`,
      slug: 'products',
      description: `Explore our range of products at ${businessName}.`,
      keywords: ['products', businessName.toLowerCase(), 'catalog'],
      blocks: [
        {
          type: 'hero',
          content: {
            title: 'Our Products',
            subtitle: 'Quality Products for Your Needs',
            description: request.prompt || 'Discover our carefully curated selection of products.'
          }
        },
        {
          type: 'product_grid',
          content: {
            title: 'Product Catalog',
            products: products,
            categories: [...new Set(products.map((p: any) => p.category))],
            showFilters: true
          }
        }
      ]
    };
  }

  private generateGenericContent(request: GeneratePageRequest, website: any): any {
    const businessName = website.businessInfo?.name || 'Our Company';
    
    return {
      title: request.prompt || 'New Page',
      slug: request.prompt?.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || 'new-page',
      description: `${request.prompt} - ${businessName}`,
      keywords: [businessName.toLowerCase()],
      blocks: [
        {
          type: 'hero',
          content: {
            title: request.prompt || 'Welcome',
            subtitle: businessName,
            description: `Learn more about ${request.prompt || 'our services'} at ${businessName}.`
          }
        },
        {
          type: 'content',
          content: {
            title: 'Content',
            content: request.prompt || 'This page was generated based on your request. You can edit this content to match your needs.'
          }
        }
      ]
    };
  }
}

export default new AIPageGenerator();
