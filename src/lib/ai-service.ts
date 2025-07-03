
interface ChutesAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GenerateWebsiteRequest {
  businessName: string;
  businessType: string;
  targetAudience: string;
  location: string;
  tone: string;
  services: string[];
  description: string;
  branding?: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    layout?: string;
  };
  pages?: string[];
}

class AIService {
  private chutesApiKey = import.meta.env.VITE_CHUTES_API_KEY || '';
  private geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  async callChutesAI(prompt: string, maxRetries = 3): Promise<string> {
    if (!this.chutesApiKey) {
      throw new Error('Chutes AI API key not configured');
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch('https://llm.chutes.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.chutesApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-ai/DeepSeek-V3-0324',
            messages: [
              {
                role: 'system',
                content: 'You are an expert web developer that generates modern, responsive HTML, CSS, and JavaScript code for business websites. Always return valid, production-ready code.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 2048,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          throw new Error(`Chutes AI API error: ${response.status}`);
        }

        const data: ChutesAIResponse = await response.json();
        return data.choices[0]?.message?.content || '';
      } catch (error) {
        console.error(`Chutes AI attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error('All Chutes AI attempts failed');
  }

  async callGeminiAI(prompt: string): Promise<string> {
    if (!this.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert web developer. Generate modern, responsive HTML, CSS, and JavaScript code. ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Gemini AI error:', error);
      throw error;
    }
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      return await this.callChutesAI(prompt);
    } catch (error) {
      console.log('Chutes AI failed, falling back to Gemini:', error);
      return await this.callGeminiAI(prompt);
    }
  }

  async generateWebsite(request: GenerateWebsiteRequest): Promise<any> {
    const prompt = `
Generate a complete, modern business website for ${request.businessName}, a ${request.businessType} business.

Business Details:
- Name: ${request.businessName}
- Type: ${request.businessType}
- Target Audience: ${request.targetAudience}
- Location: ${request.location}
- Tone: ${request.tone}
- Services: ${request.services.join(', ')}
- Description: ${request.description}

${request.branding ? `
Branding:
- Primary Color: ${request.branding.primaryColor || '#6366F1'}
- Secondary Color: ${request.branding.secondaryColor || '#8B5CF6'}
- Font Family: ${request.branding.fontFamily || 'Inter'}
- Layout Style: ${request.branding.layout || 'modern'}
` : ''}

${request.pages ? `
Required Pages: ${request.pages.join(', ')}
` : ''}

Generate a complete website structure with:
1. Modern, responsive HTML pages
2. Professional CSS styling using the brand colors
3. Interactive JavaScript functionality
4. SEO-optimized content
5. Mobile-first design

Return a JSON structure with pages array containing objects with: title, slug, type, htmlContent, cssContent, jsContent, seoMeta.
Make the code production-ready and highly customizable.
`;

    try {
      const response = await this.generateContent(prompt);
      
      // Try to parse JSON response
      let websiteData;
      try {
        websiteData = JSON.parse(response);
      } catch {
        // If not JSON, create a structure from the response
        websiteData = this.parseWebsiteResponse(response, request);
      }

      return {
        ...websiteData,
        theme: {
          primaryColor: request.branding?.primaryColor || '#6366F1',
          secondaryColor: request.branding?.secondaryColor || '#8B5CF6',
          accentColor: '#FF6B6B',
          fontFamily: request.branding?.fontFamily || 'Inter',
          fontHeading: request.branding?.fontFamily || 'Inter',
          borderRadius: 'medium',
          spacing: 'comfortable',
        },
        seoConfig: {
          metaTitle: `${request.businessName} - Professional ${request.businessType}`,
          metaDescription: `${request.businessName} offers professional ${request.businessType.toLowerCase()} services in ${request.location}.`,
          keywords: [request.businessType.toLowerCase(), ...request.services.map(s => s.toLowerCase()), request.location.toLowerCase()],
          ogImage: '',
          sitemap: true,
          robotsTxt: 'index,follow',
        }
      };
    } catch (error) {
      console.error('Website generation error:', error);
      return this.getFallbackWebsite(request);
    }
  }

  private parseWebsiteResponse(response: string, request: GenerateWebsiteRequest): any {
    // Extract HTML, CSS, JS from response if not JSON
    const pages = (request.pages || ['Home', 'About', 'Services', 'Contact']).map((pageTitle, index) => ({
      title: pageTitle,
      slug: pageTitle.toLowerCase().replace(/\s+/g, '-'),
      type: pageTitle.toLowerCase() === 'home' ? 'home' : 'page',
      htmlContent: this.extractCodeBlock(response, 'html') || this.generateFallbackHTML(pageTitle, request),
      cssContent: this.extractCodeBlock(response, 'css') || this.generateFallbackCSS(request),
      jsContent: this.extractCodeBlock(response, 'javascript') || this.generateFallbackJS(),
      seoMeta: {
        title: `${pageTitle} - ${request.businessName}`,
        description: `${pageTitle} page for ${request.businessName}, a professional ${request.businessType} business.`,
        keywords: [pageTitle.toLowerCase(), request.businessType.toLowerCase()]
      }
    }));

    return { pages };
  }

  private extractCodeBlock(text: string, language: string): string {
    const regex = new RegExp(`\`\`\`${language}([\\s\\S]*?)\`\`\``, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private generateFallbackHTML(pageTitle: string, request: GenerateWebsiteRequest): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} - ${request.businessName}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">${request.businessName}</div>
            <div class="nav-links">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#contact">Contact</a>
            </div>
        </nav>
    </header>
    
    <main class="main">
        <section class="hero">
            <div class="hero-content">
                <h1>${pageTitle === 'Home' ? `Welcome to ${request.businessName}` : pageTitle}</h1>
                <p>Professional ${request.businessType} services in ${request.location}</p>
                ${pageTitle === 'Home' ? '<button class="cta-button">Get Started</button>' : ''}
            </div>
        </section>
        
        ${pageTitle === 'Services' ? `
        <section class="services">
            <h2>Our Services</h2>
            <div class="services-grid">
                ${request.services.map(service => `
                <div class="service-card">
                    <h3>${service}</h3>
                    <p>Professional ${service.toLowerCase()} services tailored to your needs.</p>
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}
    </main>
    
    <footer class="footer">
        <p>&copy; 2024 ${request.businessName}. All rights reserved.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateFallbackCSS(request: GenerateWebsiteRequest): string {
    const primaryColor = request.branding?.primaryColor || '#6366F1';
    const secondaryColor = request.branding?.secondaryColor || '#8B5CF6';
    
    return `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: ${request.branding?.fontFamily || 'Inter, sans-serif'};
    line-height: 1.6;
    color: #333;
}

.header {
    background: ${primaryColor};
    color: white;
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.main {
    margin-top: 80px;
}

.hero {
    background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
    color: white;
    text-align: center;
    padding: 4rem 2rem;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.cta-button {
    background: white;
    color: ${primaryColor};
    padding: 1rem 2rem;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

.services {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.services h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}

.service-card:hover {
    transform: translateY(-5px);
}

.service-card h3 {
    color: ${primaryColor};
    margin-bottom: 1rem;
}

.footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 4rem;
}

@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
}`;
  }

  private generateFallbackJS(): string {
    return `
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const createMobileMenu = () => {
    const nav = document.querySelector('.nav');
    if (window.innerWidth <= 768) {
        nav.classList.add('mobile');
    } else {
        nav.classList.remove('mobile');
    }
};

window.addEventListener('resize', createMobileMenu);
document.addEventListener('DOMContentLoaded', createMobileMenu);

// Intersection Observer for animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s, transform 0.6s';
        observer.observe(card);
    });
};

document.addEventListener('DOMContentLoaded', observeElements);`;
  }

  private getFallbackWebsite(request: GenerateWebsiteRequest): any {
    const pages = (request.pages || ['Home', 'About', 'Services', 'Contact']).map(pageTitle => ({
      title: pageTitle,
      slug: pageTitle.toLowerCase().replace(/\s+/g, '-'),
      type: pageTitle.toLowerCase() === 'home' ? 'home' : 'page',
      htmlContent: this.generateFallbackHTML(pageTitle, request),
      cssContent: this.generateFallbackCSS(request),
      jsContent: this.generateFallbackJS(),
      seoMeta: {
        title: `${pageTitle} - ${request.businessName}`,
        description: `${pageTitle} page for ${request.businessName}`,
        keywords: [pageTitle.toLowerCase(), request.businessType.toLowerCase()]
      }
    }));

    return { pages };
  }

  async generateBlogPost(topic: string, businessInfo: any): Promise<any> {
    const prompt = `
Write a comprehensive, engaging blog post about "${topic}" for ${businessInfo.name || 'the business'}, a ${businessInfo.type || 'business'} company.

The blog post should be:
- Professional and informative
- SEO-optimized with relevant keywords
- 800-1200 words long
- Include a compelling title and meta description
- Have clear sections with headings
- Be relevant to the business and its audience

Return a JSON object with: title, content, excerpt, tags, category, seoTitle, seoDescription.
`;

    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Blog post generation error:', error);
      return {
        title: `Understanding ${topic}`,
        content: `<h2>Introduction</h2><p>This is a comprehensive guide about ${topic}...</p>`,
        excerpt: `Learn everything you need to know about ${topic} in this detailed guide.`,
        tags: [topic.toLowerCase()],
        category: 'general',
        seoTitle: `${topic} - Complete Guide`,
        seoDescription: `Comprehensive guide about ${topic} with expert insights and practical tips.`
      };
    }
  }

  async generateFAQs(businessInfo: any): Promise<any[]> {
    const prompt = `
Generate 8-10 frequently asked questions and answers for ${businessInfo.businessName}, a ${businessInfo.businessType} business.

Services offered: ${businessInfo.services.join(', ')}
Location: ${businessInfo.location}
Target audience: ${businessInfo.targetAudience}

Make the FAQs relevant, helpful, and specific to this business type. Include questions about services, pricing, process, location, etc.

Return a JSON array of objects with: question, answer, category.
`;

    try {
      const response = await this.generateContent(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('FAQ generation error:', error);
      return [
        {
          question: "What services do you offer?",
          answer: `We offer ${businessInfo.services.join(', ')} services tailored to your needs.`,
          category: "services"
        },
        {
          question: "Where are you located?",
          answer: `We are located in ${businessInfo.location} and serve the surrounding areas.`,
          category: "location"
        }
      ];
    }
  }

  async editContent(currentContent: string, prompt: string): Promise<string> {
    const editPrompt = `
Edit the following content based on this instruction: "${prompt}"

Current content:
${currentContent}

Return the edited content maintaining the same format and structure but incorporating the requested changes.
`;

    try {
      return await this.generateContent(editPrompt);
    } catch (error) {
      console.error('Content editing error:', error);
      return currentContent;
    }
  }
}

export const aiService = new AIService();
export default aiService;
