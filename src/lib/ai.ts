// AI Service for Gemini 2.5 Flash integration
interface BusinessInfo {
  businessType: string;
  targetAudience: string;
  location: string;
  tone: string;
  services: string[];
  businessName: string;
}

interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
}

class AIService {
  private apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key';
  
  async generateWebsite(businessInfo: BusinessInfo): Promise<{
    pages: any[];
    theme: any;
    seoConfig: any;
  }> {
    // For demo mode, return structured content
    if (this.apiKey === 'demo-key') {
      return this.generateDemoWebsite(businessInfo);
    }

    try {
      const prompt = this.buildWebsitePrompt(businessInfo);
      const response = await this.callGemini(prompt);
      return this.parseWebsiteResponse(response.content);
    } catch (error) {
      console.error('AI website generation failed:', error);
      return this.generateDemoWebsite(businessInfo);
    }
  }

  async editContent(currentContent: string, editPrompt: string): Promise<string> {
    if (this.apiKey === 'demo-key') {
      return this.generateDemoEdit(currentContent, editPrompt);
    }

    try {
      const prompt = `Edit this content based on the instruction: "${editPrompt}"\n\nCurrent content: ${currentContent}\n\nReturn only the edited content:`;
      const response = await this.callGemini(prompt);
      return response.content;
    } catch (error) {
      console.error('AI content editing failed:', error);
      return currentContent + ' (edited with AI assistance)';
    }
  }

  async generateBlogPost(title: string, tone: string = 'professional'): Promise<{
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
  }> {
    if (this.apiKey === 'demo-key') {
      return {
        title,
        content: `# ${title}\n\nThis is an AI-generated blog post about ${title.toLowerCase()}. The content would be comprehensive and engaging, written in a ${tone} tone.\n\n## Introduction\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\n## Main Points\n\n- Key insight about the topic\n- Important considerations\n- Best practices and recommendations\n\n## Conclusion\n\nIn conclusion, this topic requires careful consideration and ongoing attention.`,
        excerpt: `An insightful exploration of ${title.toLowerCase()} with practical advice and expert insights.`,
        tags: ['business', 'insights', 'tips']
      };
    }

    // Real AI implementation would go here
    return this.generateBlogPost(title, tone);
  }

  async generateFAQs(businessInfo: BusinessInfo): Promise<Array<{
    question: string;
    answer: string;
  }>> {
    // Generate common FAQs based on business type
    const commonFAQs = [
      {
        question: `What services does ${businessInfo.businessName} offer?`,
        answer: `We specialize in ${businessInfo.services.join(', ')} for ${businessInfo.targetAudience} in ${businessInfo.location}.`
      },
      {
        question: 'How can I contact you?',
        answer: 'You can reach us through our contact form, email, or phone. We typically respond within 24 hours.'
      },
      {
        question: 'What are your business hours?',
        answer: 'We operate Monday through Friday, 9 AM to 6 PM. Weekend appointments may be available upon request.'
      },
      {
        question: 'Do you serve my area?',
        answer: `We primarily serve ${businessInfo.location} and surrounding areas. Contact us to confirm service availability in your location.`
      }
    ];

    return commonFAQs;
  }

  async generateSEOSuggestions(content: string, keywords: string[]): Promise<{
    score: number;
    issues: Array<{
      type: 'error' | 'warning' | 'info';
      title: string;
      description: string;
      fix: string;
    }>;
    keywords: string[];
    recommendations: string[];
  }> {
    if (this.apiKey === 'demo-key') {
      return {
        score: 75,
        issues: [
          {
            type: 'warning',
            title: 'Missing Meta Description',
            description: 'Page is missing a meta description which is important for search results.',
            fix: 'Add a compelling 150-160 character meta description that includes your target keywords.'
          },
          {
            type: 'info',
            title: 'Image Alt Text',
            description: 'Some images are missing alt text for better accessibility and SEO.',
            fix: 'Add descriptive alt text to all images mentioning relevant keywords when appropriate.'
          },
          {
            type: 'error',
            title: 'Page Load Speed',
            description: 'Page load time could be improved for better user experience and SEO.',
            fix: 'Optimize images and reduce unnecessary JavaScript to improve load times.'
          }
        ],
        keywords: keywords.length > 0 ? keywords : ['business', 'service', 'local'],
        recommendations: [
          'Add more internal links between related pages',
          'Create a blog to target long-tail keywords',
          'Optimize for local SEO with location-based keywords',
          'Add schema markup for better search engine understanding'
        ]
      };
    }

    try {
      const prompt = `Analyze this content for SEO optimization: "${content.substring(0, 500)}..."
      Target keywords: ${keywords.join(', ')}
      
      Provide SEO analysis with:
      1. Overall SEO score (0-100)
      2. Issues found (errors, warnings, info)
      3. Specific recommendations for improvement
      4. Keyword optimization suggestions
      
      Return as structured data.`;
      
      const response = await this.callGemini(prompt);
      return this.parseSEOResponse(response.content, keywords);
    } catch (error) {
      console.error('SEO analysis failed:', error);
      // Return demo data as fallback
      return this.generateSEOSuggestions(content, keywords);
    }
  }

  private async callGemini(prompt: string): Promise<AIResponse> {
    // This would integrate with actual Gemini API
    // For now, return demo response
    return {
      content: `AI-generated response for: ${prompt.substring(0, 50)}...`,
      success: true
    };
  }

  private buildWebsitePrompt(businessInfo: BusinessInfo): string {
    return `Create a professional website structure for a ${businessInfo.businessType} business named "${businessInfo.businessName}". 
    
    Business details:
    - Target audience: ${businessInfo.targetAudience}
    - Location: ${businessInfo.location}
    - Tone: ${businessInfo.tone}
    - Services: ${businessInfo.services.join(', ')}
    
    Generate:
    1. Site architecture with pages
    2. SEO-optimized content for each page
    3. Theme colors and fonts
    4. Page structure with sections
    
    Return as structured JSON.`;
  }

  private generateDemoWebsite(businessInfo: BusinessInfo) {
    return {
      pages: [
        {
          title: 'Home',
          slug: 'home',
          type: 'home',
          blocks: [
            {
              type: 'hero',
              content: {
                headline: `Welcome to ${businessInfo.businessName}`,
                subheadline: `Professional ${businessInfo.businessType.toLowerCase()} services for ${businessInfo.targetAudience.toLowerCase()} in ${businessInfo.location}`,
                cta: 'Get Started Today'
              }
            },
            {
              type: 'services',
              content: {
                title: 'Our Services',
                services: businessInfo.services.map(service => ({
                  title: service,
                  description: `Professional ${service.toLowerCase()} services tailored to your needs.`
                }))
              }
            },
            {
              type: 'cta',
              content: {
                title: 'Ready to Get Started?',
                description: 'Contact us today for a consultation.',
                buttonText: 'Contact Us'
              }
            }
          ]
        },
        {
          title: 'About',
          slug: 'about',
          type: 'about',
          blocks: [
            {
              type: 'about',
              content: {
                title: `About ${businessInfo.businessName}`,
                content: `We are a ${businessInfo.tone.toLowerCase()} ${businessInfo.businessType.toLowerCase()} company serving ${businessInfo.targetAudience.toLowerCase()} in ${businessInfo.location}. Our mission is to provide exceptional service and value to our clients.`
              }
            }
          ]
        },
        {
          title: 'Services',
          slug: 'services',
          type: 'services',
          blocks: [
            {
              type: 'services-detail',
              content: {
                title: 'Our Services',
                services: businessInfo.services.map(service => ({
                  title: service,
                  description: `Comprehensive ${service.toLowerCase()} solutions designed for ${businessInfo.targetAudience.toLowerCase()}.`,
                  features: ['Expert consultation', 'Tailored solutions', 'Ongoing support']
                }))
              }
            }
          ]
        },
        {
          title: 'Contact',
          slug: 'contact',
          type: 'contact',
          blocks: [
            {
              type: 'contact',
              content: {
                title: 'Get In Touch',
                description: 'Ready to discuss your needs? Contact us today.',
                email: 'info@example.com',
                phone: '(555) 123-4567',
                address: businessInfo.location
              }
            }
          ]
        }
      ],
      theme: {
        primaryColor: '#6366F1',
        secondaryColor: '#8B5CF6',
        accentColor: '#FF6B6B',
        fontFamily: 'Inter',
        fontHeading: 'Inter',
        borderRadius: 'medium',
        spacing: 'comfortable'
      },
      seoConfig: {
        metaTitle: `${businessInfo.businessName} - ${businessInfo.businessType} in ${businessInfo.location}`,
        metaDescription: `Professional ${businessInfo.businessType.toLowerCase()} services for ${businessInfo.targetAudience.toLowerCase()} in ${businessInfo.location}. ${businessInfo.services.join(', ')}.`,
        keywords: [...businessInfo.services, businessInfo.businessType, businessInfo.location],
        ogImage: '',
        sitemap: true,
        robotsTxt: 'index,follow'
      }
    };
  }

  private parseWebsiteResponse(content: string) {
    // Parse AI response into structured format
    // For demo, return basic structure
    return this.generateDemoWebsite({
      businessName: 'Demo Business',
      businessType: 'Service',
      targetAudience: 'Professionals',
      location: 'Local Area',
      tone: 'Professional',
      services: ['Consulting', 'Support']
    });
  }

  private parseSEOResponse(content: string, keywords: string[]) {
    // Parse AI response into structured SEO format
    // For demo, return basic structure
    return {
      score: 78,
      issues: [
        {
          type: 'warning' as const,
          title: 'Content Length',
          description: 'Content could be more comprehensive for better SEO ranking.',
          fix: 'Expand sections with more detailed information and target keywords.'
        }
      ],
      keywords: keywords.length > 0 ? keywords : ['business', 'professional', 'service'],
      recommendations: [
        'Improve content depth and keyword density',
        'Add more semantic keywords related to your business',
        'Include location-based keywords for local SEO'
      ]
    };
  }

  private generateDemoEdit(currentContent: string, editPrompt: string): string {
    // Simple demo editing logic
    if (editPrompt.includes('casual') || editPrompt.includes('friendly')) {
      return currentContent.replace(/\./g, '! 😊').replace(/We are/g, "We're").replace(/Our/g, "Our amazing");
    }
    if (editPrompt.includes('professional') || editPrompt.includes('formal')) {
      return currentContent.replace(/!/g, '.').replace(/amazing/g, '').replace(/😊/g, '');
    }
    return currentContent + ' (Updated based on: ' + editPrompt + ')';
  }
}

export const aiService = new AIService();
