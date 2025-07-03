import { Configuration, OpenAIApi } from 'openai';

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

  constructor() {
    this.chutesApiKey = import.meta.env.VITE_CHUTES_API_KEY || '';
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  private async callChutesAPI(messages: any[]): Promise<string> {
    const url = 'https://api.chutes.ai/generate';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.chutesApiKey}`,
    };
  
    const body = JSON.stringify({
      model: 'gemini-1.5-pro-latest',
      messages: messages,
      max_tokens: 4096,
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
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

  async generateWebsite(websiteData: WebsiteData): Promise<any> {
    const prompt = `
      Generate a complete website structure based on the following data:
      ${JSON.stringify(websiteData, null, 2)}

      Include:
      - theme (colors, fonts, styles)
      - seoConfig (title, description, keywords)
      - pages (title, slug, type, htmlContent, cssContent, jsContent, seoMeta)

      Ensure valid HTML, CSS, and JavaScript.
    `;

    try {
      const response = await this.callChutesAPI([
        {
          role: 'user',
          content: prompt,
        },
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating website:', error);
      throw new Error('Failed to generate website');
    }
  }

  async generateFAQs(websiteData: WebsiteData): Promise<FAQData[]> {
    const prompt = `
      Generate FAQs based on the following business data:
      ${JSON.stringify(websiteData, null, 2)}

      Include question and answer.
    `;

    try {
      const response = await this.callChutesAPI([
        {
          role: 'user',
          content: prompt,
        },
      ]);

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating FAQs:', error);
      throw new Error('Failed to generate FAQs');
    }
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    try {
      const response = await this.callChutesAPI([
        {
          role: 'user',
          content: `${prompt}\n\nContext: ${context ? JSON.stringify(context) : 'None'}`
        }
      ]);

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}

// Export both the class and an instance
export { AIService };
export const aiService = new AIService();
export default aiService;
