
// Remove OpenAI import and add missing methods

interface WebsiteData {
  businessName: string;
  businessType: string;
  targetAudience: string;
  location: string;
  tone: string;
  services: string[];
  description: string;
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: string;
  };
  pages: string[];
}

interface FAQData {
  question: string;
  answer: string;
  category?: string;
}

class AIService {
  private chutesApiKey: string;
  private geminiApiKey: string;
  private conversations: Map<string, any> = new Map();

  constructor() {
    this.chutesApiKey = import.meta.env.VITE_CHUTES_API_KEY || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  private async callChutesAPI(messages: any[]): Promise<string> {
    // Use the correct Chutes AI endpoint
    const url = 'https://llm.chutes.ai/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.chutesApiKey}`,
    };
  
    const body = JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3-0324',
      messages: messages,
      max_tokens: 4096,
      temperature: 0.7,
      stream: false
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Chutes API error:', errorData);
        throw new Error(`Chutes API call failed with status ${response.status}: ${errorData.error || 'Unknown error'}`);
      }
  
      const data = await response.json();
      const content = data.choices[0].message.content;
      return content;
    } catch (error: any) {
      console.error('Error calling Chutes API:', error);
      throw new Error(`Failed to call Chutes API: ${error.message}`);
    }
  }

  private async callGeminiAPI(messages: any[]): Promise<string> {
    // Fallback to Gemini API if Chutes fails
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.geminiApiKey}`;
    
    const prompt = messages.map(m => m.content).join('\n');
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API call failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error: any) {
      console.error('Error calling Gemini API:', error);
      throw new Error(`Failed to call Gemeni API: ${error.message}`);
    }
  }

  async generateWebsite(websiteData: WebsiteData): Promise<any> {
    const prompt = `
      Generate a complete professional website structure based on the following data:
      ${JSON.stringify(websiteData, null, 2)}

      Create a modern, responsive website with the following requirements:
      1. Generate actual HTML, CSS, and JavaScript code for each page
      2. Use semantic HTML5 elements
      3. Apply the specified branding colors and fonts
      4. Make it fully responsive with mobile-first design
      5. Include interactive elements and smooth animations
      6. Optimize for SEO with proper meta tags
      7. Ensure accessibility with proper ARIA labels

      Return a JSON object with this exact structure:
      {
        "pages": [
          {
            "title": "Page Title",
            "slug": "page-slug",
            "type": "page-type",
            "htmlContent": "Complete HTML structure",
            "cssContent": "CSS styles for this page",
            "jsContent": "JavaScript functionality",
            "seoMeta": {
              "title": "SEO title",
              "description": "SEO description",
              "keywords": ["keyword1", "keyword2"]
            }
          }
        ],
        "theme": {
          "primaryColor": "${websiteData.branding.primaryColor}",
          "secondaryColor": "${websiteData.branding.secondaryColor}",
          "fontFamily": "${websiteData.branding.fontFamily}",
          "layout": "${websiteData.branding.layout}"
        },
        "seoConfig": {
          "siteName": "${websiteData.businessName}",
          "siteDescription": "Professional ${websiteData.businessType} services",
          "keywords": ${JSON.stringify([...websiteData.services, websiteData.businessType, websiteData.location])},
          "ogImage": "",
          "twitterCard": "summary_large_image"
        }
      }

      Make sure each page has unique, high-quality content relevant to the business type and services.
      Use modern CSS features like Grid, Flexbox, and CSS Variables.
      Include JavaScript for form validation, smooth scrolling, and interactive elements.
    `;

    try {
      console.log('Calling Chutes AI for website generation...');
      const response = await this.callChutesAPI([
        {
          role: 'user',
          content: prompt,
        },
      ]);

      // Try to parse the JSON response
      try {
        return JSON.parse(response);
      } catch (parseError) {
        console.warn('Failed to parse AI response as JSON, using fallback structure');
        // Return a structured fallback if parsing fails
        return this.generateFallbackWebsite(websiteData);
      }
    } catch (error) {
      console.error('Chutes API failed, trying Gemini fallback:', error);
      
      try {
        const response = await this.callGeminiAPI([
          {
            role: 'user',
            content: prompt,
          },
        ]);

        try {
          return JSON.parse(response);
        } catch (parseError) {
          return this.generateFallbackWebsite(websiteData);
        }
      } catch (geminiError) {
        console.error('Both AI services failed, using fallback:', geminiError);
        return this.generateFallbackWebsite(websiteData);
      }
    }
  }

  private generateFallbackWebsite(websiteData: WebsiteData): any {
    return {
      pages: websiteData.pages.map(pageName => ({
        title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
        slug: pageName.toLowerCase(),
        type: pageName.toLowerCase(),
        htmlContent: this.generatePageHTML(pageName, websiteData),
        cssContent: this.generatePageCSS(websiteData),
        jsContent: this.generatePageJS(),
        seoMeta: {
          title: `${pageName} - ${websiteData.businessName}`,
          description: `${pageName} page for ${websiteData.businessName} - ${websiteData.description.substring(0, 160)}`,
          keywords: [...websiteData.services, websiteData.businessType, pageName]
        }
      })),
      theme: websiteData.branding,
      seoConfig: {
        siteName: websiteData.businessName,
        siteDescription: websiteData.description,
        keywords: [...websiteData.services, websiteData.businessType, websiteData.location],
        ogImage: websiteData.branding.logo || '',
        twitterCard: 'summary_large_image'
      }
    };
  }

  private generatePageHTML(pageName: string, websiteData: WebsiteData): string {
    const isHomePage = pageName.toLowerCase() === 'home';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isHomePage ? websiteData.businessName : `${pageName} - ${websiteData.businessName}`}</title>
</head>
<body>
    <header class="header">
        <nav class="nav">
            <div class="nav-brand">
                ${websiteData.branding.logo ? `<img src="${websiteData.branding.logo}" alt="${websiteData.businessName}" class="logo">` : ''}
                <h1>${websiteData.businessName}</h1>
            </div>
            <ul class="nav-menu">
                ${websiteData.pages.map(page => 
                  `<li><a href="#${page.toLowerCase()}" class="nav-link">${page.charAt(0).toUpperCase() + page.slice(1)}</a></li>`
                ).join('')}
            </ul>
        </nav>
    </header>

    <main class="main">
        ${isHomePage ? this.generateHomeContent(websiteData) : this.generatePageContent(pageName, websiteData)}
    </main>

    <footer class="footer">
        <div class="footer-content">
            <p>&copy; 2024 ${websiteData.businessName}. All rights reserved.</p>
            <p>Located in ${websiteData.location}</p>
        </div>
    </footer>
</body>
</html>`;
  }

  private generateHomeContent(websiteData: WebsiteData): string {
    return `
        <section class="hero">
            <div class="hero-content">
                <h1>Welcome to ${websiteData.businessName}</h1>
                <p class="hero-subtitle">Professional ${websiteData.businessType} services in ${websiteData.location}</p>
                <p class="hero-description">${websiteData.description}</p>
                <a href="#contact" class="cta-button">Get Started Today</a>
            </div>
        </section>

        <section class="services">
            <div class="container">
                <h2>Our Services</h2>
                <div class="services-grid">
                    ${websiteData.services.map(service => `
                        <div class="service-card">
                            <h3>${service}</h3>
                            <p>Professional ${service.toLowerCase()} services tailored to your needs.</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section class="cta-section">
            <div class="container">
                <h2>Ready to Get Started?</h2>
                <p>Contact us today for a consultation about your ${websiteData.businessType.toLowerCase()} needs.</p>
                <a href="#contact" class="cta-button">Contact Us Now</a>
            </div>
        </section>`;
  }

  private generatePageContent(pageName: string, websiteData: WebsiteData): string {
    switch (pageName.toLowerCase()) {
      case 'about':
        return `
        <section class="page-hero">
            <div class="container">
                <h1>About ${websiteData.businessName}</h1>
                <p class="page-subtitle">Learn more about our ${websiteData.businessType.toLowerCase()} business</p>
            </div>
        </section>

        <section class="about-content">
            <div class="container">
                <div class="about-text">
                    <h2>Our Story</h2>
                    <p>${websiteData.description}</p>
                    <p>We are a ${websiteData.tone.toLowerCase()} ${websiteData.businessType.toLowerCase()} company serving ${websiteData.targetAudience.toLowerCase()} in ${websiteData.location}.</p>
                    
                    <h3>Why Choose Us?</h3>
                    <ul>
                        <li>Expert knowledge in ${websiteData.services.join(', ')}</li>
                        <li>Committed to ${websiteData.targetAudience.toLowerCase()} satisfaction</li>
                        <li>Local presence in ${websiteData.location}</li>
                        <li>${websiteData.tone.charAt(0).toUpperCase() + websiteData.tone.slice(1)} approach to business</li>
                    </ul>
                </div>
            </div>
        </section>`;

      case 'services':
        return `
        <section class="page-hero">
            <div class="container">
                <h1>Our Services</h1>
                <p class="page-subtitle">Comprehensive ${websiteData.businessType.toLowerCase()} solutions</p>
            </div>
        </section>

        <section class="services-detail">
            <div class="container">
                <div class="services-grid">
                    ${websiteData.services.map(service => `
                        <div class="service-detail-card">
                            <h3>${service}</h3>
                            <p>Comprehensive ${service.toLowerCase()} solutions designed specifically for ${websiteData.targetAudience.toLowerCase()}.</p>
                            <ul class="service-features">
                                <li>Expert consultation and planning</li>
                                <li>Tailored solutions for your needs</li>
                                <li>Ongoing support and maintenance</li>
                                <li>Competitive pricing and value</li>
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>`;

      case 'contact':
        return `
        <section class="page-hero">
            <div class="container">
                <h1>Contact Us</h1>
                <p class="page-subtitle">Get in touch with ${websiteData.businessName}</p>
            </div>
        </section>

        <section class="contact-content">
            <div class="container">
                <div class="contact-grid">
                    <div class="contact-info">
                        <h3>Get In Touch</h3>
                        <p>Ready to discuss your ${websiteData.businessType.toLowerCase()} needs? Contact us today!</p>
                        
                        <div class="contact-details">
                            <div class="contact-item">
                                <strong>Location:</strong>
                                <p>${websiteData.location}</p>
                            </div>
                            <div class="contact-item">
                                <strong>Email:</strong>
                                <p>info@${websiteData.businessName.toLowerCase().replace(/\s+/g, '')}.com</p>
                            </div>
                            <div class="contact-item">
                                <strong>Phone:</strong>
                                <p>(555) 123-4567</p>
                            </div>
                        </div>
                    </div>

                    <div class="contact-form">
                        <form class="form">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="service">Service Interested In</label>
                                <select id="service" name="service">
                                    ${websiteData.services.map(service => `<option value="${service}">${service}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="cta-button">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>`;

      default:
        return `
        <section class="page-hero">
            <div class="container">
                <h1>${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h1>
                <p class="page-subtitle">${websiteData.businessName} - ${pageName}</p>
            </div>
        </section>

        <section class="page-content">
            <div class="container">
                <p>Welcome to the ${pageName.toLowerCase()} page of ${websiteData.businessName}.</p>
                <p>${websiteData.description}</p>
            </div>
        </section>`;
    }
  }

  private generatePageCSS(websiteData: WebsiteData): string {
    return `
:root {
    --primary-color: ${websiteData.branding.primaryColor};
    --secondary-color: ${websiteData.branding.secondaryColor};
    --font-family: '${websiteData.branding.fontFamily}', sans-serif;
    --max-width: 1200px;
    --spacing: 1rem;
    --border-radius: 8px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: #333;
    background-color: #fff;
}

.container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--spacing);
}

/* Header Styles */
.header {
    background: var(--primary-color);
    color: white;
    padding: var(--spacing) 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--spacing);
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: var(--spacing);
}

.logo {
    height: 40px;
    width: auto;
}

.nav-brand h1 {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: calc(var(--spacing) * 2);
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s ease;
}

.nav-link:hover {
    opacity: 0.8;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    padding: calc(var(--spacing) * 4) 0;
    text-align: center;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--spacing);
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: var(--spacing);
    font-weight: bold;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: var(--spacing);
    opacity: 0.9;
}

.hero-description {
    font-size: 1.1rem;
    margin-bottom: calc(var(--spacing) * 2);
    opacity: 0.9;
}

/* Page Hero */
.page-hero {
    background: var(--primary-color);
    color: white;
    padding: calc(var(--spacing) * 3) 0;
    text-align: center;
}

.page-hero h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing);
}

.page-subtitle {
    font-size: 1.2rem;
    opacity: 0.9;
}

/* Buttons */
.cta-button {
    display: inline-block;
    background: var(--secondary-color);
    color: white;
    padding: calc(var(--spacing) * 0.75) calc(var(--spacing) * 1.5);
    text-decoration: none;
    border-radius: var(--border-radius);
    font-weight: bold;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Services Section */
.services {
    padding: calc(var(--spacing) * 4) 0;
    background: #f8f9fa;
}

.services h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: calc(var(--spacing) * 2);
    color: var(--primary-color);
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: calc(var(--spacing) * 1.5);
}

.service-card, .service-detail-card {
    background: white;
    padding: calc(var(--spacing) * 1.5);
    border-radius: var(--border-radius);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.service-card:hover, .service-detail-card:hover {
    transform: translateY(-5px);
}

.service-card h3, .service-detail-card h3 {
    color: var(--primary-color);
    margin-bottom: var(--spacing);
    font-size: 1.3rem;
}

.service-features {
    list-style: none;
    margin-top: var(--spacing);
}

.service-features li {
    padding: 0.25rem 0;
    position: relative;
    padding-left: 1.5rem;
}

.service-features li:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--secondary-color);
    font-weight: bold;
}

/* CTA Section */
.cta-section {
    background: var(--secondary-color);
    color: white;
    padding: calc(var(--spacing) * 4) 0;
    text-align: center;
}

.cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing);
}

.cta-section p {
    font-size: 1.2rem;
    margin-bottom: calc(var(--spacing) * 2);
    opacity: 0.9;
}

/* Page Content */
.page-content, .about-content, .services-detail, .contact-content {
    padding: calc(var(--spacing) * 4) 0;
}

.about-text h2, .about-text h3 {
    color: var(--primary-color);
    margin-bottom: var(--spacing);
}

.about-text h2 {
    font-size: 2rem;
}

.about-text h3 {
    font-size: 1.5rem;
    margin-top: calc(var(--spacing) * 2);
}

.about-text ul {
    margin: var(--spacing) 0;
    padding-left: calc(var(--spacing) * 1.5);
}

.about-text li {
    margin-bottom: 0.5rem;
}

/* Contact Section */
.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(var(--spacing) * 3);
}

.contact-info h3 {
    color: var(--primary-color);
    font-size: 1.5rem;
    margin-bottom: var(--spacing);
}

.contact-item {
    margin-bottom: calc(var(--spacing) * 1.5);
}

.contact-item strong {
    color: var(--primary-color);
    display: block;
    margin-bottom: 0.25rem;
}

/* Forms */
.form {
    background: #f8f9fa;
    padding: calc(var(--spacing) * 2);
    border-radius: var(--border-radius);
}

.form-group {
    margin-bottom: var(--spacing);
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--primary-color);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    font-family: var(--font-family);
    font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
}

/* Footer */
.footer {
    background: #333;
    color: white;
    padding: calc(var(--spacing) * 2) 0;
    text-align: center;
}

.footer-content p {
    margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav {
        flex-direction: column;
        gap: var(--spacing);
    }
    
    .nav-menu {
        gap: var(--spacing);
    }
    
    .hero h1 {
        font-size: 2rem;
    }
    
    .page-hero h1 {
        font-size: 2rem;
    }
    
    .services h2, .cta-section h2 {
        font-size: 2rem;
    }
    
    .contact-grid {
        grid-template-columns: 1fr;
        gap: calc(var(--spacing) * 2);
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .hero h1 {
        font-size: 1.75rem;
    }
    
    .hero-content {
        padding: 0 calc(var(--spacing) * 0.5);
    }
}`;
  }

  private generatePageJS(): string {
    return `
// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const ctaButtons = document.querySelectorAll('.cta-button[href^="#"]');
    
    [...navLinks, ...ctaButtons].forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
    
    // Add scroll effect to header
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add loading animation to service cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const serviceCards = document.querySelectorAll('.service-card, .service-detail-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});`;
  }

  async generateFAQs(websiteData: WebsiteData): Promise<FAQData[]> {
    const prompt = `
      Generate comprehensive FAQs for a ${websiteData.businessType} business named "${websiteData.businessName}".
      
      Business details:
      - Services: ${websiteData.services.join(', ')}
      - Location: ${websiteData.location}
      - Target audience: ${websiteData.targetAudience}
      - Description: ${websiteData.description}
      
      Generate 8-12 relevant FAQs that potential customers would ask.
      Return as JSON array with format: [{"question": "...", "answer": "...", "category": "..."}]
    `;

    try {
      const response = await this.callChutesAPI([
        {
          role: 'user',
          content: prompt,
        },
      ]);

      try {
        return JSON.parse(response);
      } catch (parseError) {
        return this.generateFallbackFAQs(websiteData);
      }
    } catch (error) {
      console.error('Error generating FAQs:', error);
      return this.generateFallbackFAQs(websiteData);
    }
  }

  private generateFallbackFAQs(websiteData: WebsiteData): FAQData[] {
    return [
      {
        question: `What services does ${websiteData.businessName} offer?`,
        answer: `We specialize in ${websiteData.services.join(', ')} for ${websiteData.targetAudience} in ${websiteData.location}. ${websiteData.description}`,
        category: 'services'
      },
      {
        question: 'How can I contact you?',
        answer: 'You can reach us through our contact form, email, or phone. We typically respond within 24 hours during business days.',
        category: 'contact'
      },
      {
        question: 'What are your business hours?',
        answer: 'We operate Monday through Friday, 9 AM to 6 PM. Weekend appointments may be available upon request.',
        category: 'general'
      },
      {
        question: 'Do you serve my area?',
        answer: `We primarily serve ${websiteData.location} and surrounding areas. Contact us to confirm service availability in your specific location.`,
        category: 'location'
      },
      {
        question: 'What makes you different from competitors?',
        answer: `Our ${websiteData.tone.toLowerCase()} approach and focus on ${websiteData.targetAudience.toLowerCase()} sets us apart. We combine expertise in ${websiteData.services.join(' and ')} with personalized service.`,
        category: 'about'
      },
      {
        question: 'How do I get started?',
        answer: 'Simply contact us through our website or phone to schedule a consultation. We\'ll discuss your needs and provide a customized solution.',
        category: 'getting-started'
      }
    ];
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    try {
      const contextualPrompt = context 
        ? `Context: ${JSON.stringify(context)}\n\nUser: ${prompt}\n\nProvide a helpful response based on the context and user question.`
        : prompt;

      const response = await this.callChutesAPI([
        {
          role: 'user',
          content: contextualPrompt
        }
      ]);

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      try {
        const response = await this.callGeminiAPI([
          {
            role: 'user',
            content: context 
              ? `Context: ${JSON.stringify(context)}\n\nUser: ${prompt}\n\nProvide a helpful response.`
              : prompt
          }
        ]);
        return response;
      } catch (geminiError) {
        console.error('Both AI services failed:', geminiError);
        throw new Error('Failed to generate AI response');
      }
    }
  }

  // Add missing clearConversation method
  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }
}

// Export both the class and an instance
export { AIService };
export const aiService = new AIService();
export default aiService;
