
// AI Service Integration - Chutes AI & Gemini Fallback
interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private chutesToken: string;
  private geminiKey: string;

  constructor() {
    this.chutesToken = import.meta.env.VITE_CHUTES_API_TOKEN || '';
    this.geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  // Primary AI provider - Chutes AI
  async generateWithChutes(messages: AIMessage[], model: string = 'deepseek-ai/DeepSeek-V3-0324'): Promise<AIResponse> {
    try {
      const response = await fetch('https://llm.chutes.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.chutesToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false,
          max_tokens: 2048,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chutes AI error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage,
      };
    } catch (error) {
      console.error('Chutes AI error:', error);
      throw error;
    }
  }

  // Fallback AI provider - Gemini
  async generateWithGemini(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
        usage: {
          prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
          completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: data.usageMetadata?.totalTokenCount || 0,
        },
      };
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }
  }

  // Main generation method with fallback
  async generate(messages: AIMessage[], useGeminiFallback: boolean = true): Promise<AIResponse> {
    try {
      return await this.generateWithChutes(messages);
    } catch (error) {
      console.warn('Chutes AI failed, falling back to Gemini:', error);
      if (useGeminiFallback && this.geminiKey) {
        return await this.generateWithGemini(messages);
      }
      throw error;
    }
  }

  // Generate website content from business description
  async generateWebsiteContent(businessDescription: string, businessType: string, targetAudience: string, tone: string = 'professional'): Promise<any> {
    const prompt = `
You are an expert web designer and copywriter. Based on the following business information, create a complete website structure with content:

Business Type: ${businessType}
Business Description: ${businessDescription}
Target Audience: ${targetAudience}
Tone: ${tone}

Generate a comprehensive website structure with the following format in JSON:

{
  "siteName": "Business Name",
  "tagline": "Short memorable tagline",
  "theme": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "fontFamily": "font-name"
  },
  "pages": [
    {
      "title": "Home",
      "slug": "/",
      "type": "home",
      "seoMeta": {
        "title": "SEO title",
        "description": "Meta description",
        "keywords": ["keyword1", "keyword2"]
      },
      "blocks": [
        {
          "type": "hero",
          "content": {
            "headline": "Compelling headline",
            "subheadline": "Supporting text",
            "ctaText": "Call to action",
            "ctaLink": "#contact"
          }
        },
        {
          "type": "about",
          "content": {
            "title": "About Us",
            "description": "About section content"
          }
        },
        {
          "type": "services",
          "content": {
            "title": "Our Services",
            "services": [
              {
                "title": "Service 1",
                "description": "Service description"
              }
            ]
          }
        },
        {
          "type": "cta",
          "content": {
            "title": "Ready to get started?",
            "description": "Final call to action",
            "ctaText": "Contact Us",
            "ctaLink": "#contact"
          }
        }
      ]
    }
  ]
}

Make the content compelling, professional, and tailored to the business type and audience. Ensure all text is original and engaging.
`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert web designer and copywriter specializing in creating compelling website content for small businesses. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.generate(messages);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      throw new Error('AI response was not valid JSON');
    }
  }

  // Generate blog post content
  async generateBlogPost(title: string, keywords: string[], tone: string = 'professional'): Promise<any> {
    const prompt = `
Write a comprehensive blog post with the following specifications:

Title: ${title}
Keywords: ${keywords.join(', ')}
Tone: ${tone}

Generate the blog post in this JSON format:

{
  "title": "${title}",
  "slug": "url-friendly-slug",
  "summary": "Brief summary of the post",
  "content": "Full markdown content of the blog post (minimum 800 words)",
  "tags": ["tag1", "tag2", "tag3"],
  "seoMeta": {
    "title": "SEO optimized title",
    "description": "Meta description",
    "keywords": ["keyword1", "keyword2"]
  }
}

Make sure the content is informative, engaging, and naturally incorporates the keywords.
`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert content writer specializing in SEO-optimized blog posts. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.generate(messages);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      throw new Error('AI response was not valid JSON');
    }
  }

  // Edit content based on user prompt
  async editContent(currentContent: string, editPrompt: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a professional copywriter. Edit the provided content based on the user\'s instructions. Return only the edited content, no explanations.'
      },
      {
        role: 'user',
        content: `Current content: ${currentContent}\n\nEdit instructions: ${editPrompt}\n\nProvide the edited content:`
      }
    ];

    const response = await this.generate(messages);
    return response.content.trim();
  }

  // Generate FAQ content
  async generateFAQs(businessType: string, services: string[]): Promise<any[]> {
    const prompt = `
Generate 8-10 frequently asked questions and answers for a ${businessType} business that offers these services: ${services.join(', ')}.

Format as JSON array:
[
  {
    "question": "Question text",
    "answer": "Detailed answer"
  }
]

Make the questions realistic and the answers helpful and professional.
`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert at creating FAQ content for businesses. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.generate(messages);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      throw new Error('AI response was not valid JSON');
    }
  }

  // Generate SEO suggestions
  async generateSEOSuggestions(content: string, targetKeywords: string[]): Promise<any> {
    const prompt = `
Analyze the following content for SEO optimization:

Content: ${content}
Target Keywords: ${targetKeywords.join(', ')}

Provide SEO suggestions in this JSON format:

{
  "score": "SEO score out of 100",
  "suggestions": [
    {
      "type": "keyword_density",
      "message": "Suggestion text",
      "priority": "high|medium|low"
    }
  ],
  "recommendedTitle": "SEO optimized title",
  "recommendedDescription": "Meta description",
  "missingKeywords": ["keyword1", "keyword2"]
}
`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an SEO expert. Analyze content and provide actionable SEO recommendations. Always respond with valid JSON only.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.generate(messages);
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      throw new Error('AI response was not valid JSON');
    }
  }
}

export const aiService = new AIService();
export default aiService;
export type { AIMessage, AIResponse };
