import UniversalSDK, { 
  UniversalSDKConfig, 
  User, 
  Session,
  CloudinaryUploadResult 
} from './UniversalSDK';
import { enhancedSDKConfig } from './enhanced-sdk-config';

// Enhanced SDK Configuration with all required schemas
const sdkConfig: UniversalSDKConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER || 'demo-user',
  repo: import.meta.env.VITE_GITHUB_REPO || 'website-data',
  token: import.meta.env.VITE_GITHUB_TOKEN || 'demo-token',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
  basePath: 'db',
  mediaPath: 'media',
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  },
  smtp: {
    endpoint: import.meta.env.VITE_SMTP_ENDPOINT,
    from: import.meta.env.VITE_SMTP_FROM,
  },
  auth: {
    requireEmailVerification: false,
    otpTriggers: [],
  },
  schemas: {
    users: {
      required: ['email'],
      types: {
        email: 'string',
        password: 'string',
        verified: 'boolean',
        roles: 'array',
        permissions: 'array',
        plan: 'string',
        authMethod: 'string',
        createdAt: 'date',
        profile: 'object',
      },
      defaults: {
        verified: false,
        roles: ['user'],
        permissions: ['read'],
        plan: 'free',
        authMethod: 'email',
        createdAt: new Date().toISOString(),
        profile: {},
      },
    },
    websites: {
      required: ['userId', 'name'],
      types: {
        userId: 'string',
        name: 'string',
        domain: 'string',
        subdomain: 'string',
        theme: 'object',
        seoConfig: 'object',
        status: 'string',
        businessInfo: 'object',
        createdAt: 'date',
        updatedAt: 'date',
        publishedAt: 'date',
        analytics: 'object',
      },
      defaults: {
        status: 'draft',
        theme: {
          primaryColor: '#6366F1',
          secondaryColor: '#8B5CF6',
          accentColor: '#FF6B6B',
          fontFamily: 'Inter',
          fontHeading: 'Inter',
          borderRadius: 'medium',
          spacing: 'comfortable',
        },
        seoConfig: {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
          ogImage: '',
          sitemap: true,
          robotsTxt: 'index,follow',
        },
        businessInfo: {},
        analytics: {
          googleAnalytics: '',
          plausible: '',
          customTracking: [],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    pages: {
      required: ['websiteId', 'title', 'slug'],
      types: {
        websiteId: 'string',
        title: 'string',
        slug: 'string',
        type: 'string',
        blocks: 'array',
        seoMeta: 'object',
        status: 'string',
        order: 'number',
        parentId: 'string',
        template: 'string',
        customCss: 'string',
        customJs: 'string',
      },
      defaults: {
        type: 'page',
        blocks: [],
        seoMeta: {
          title: '',
          description: '',
          keywords: [],
          canonical: '',
          noindex: false,
        },
        status: 'published',
        order: 0,
        template: 'default',
        customCss: '',
        customJs: '',
      },
    },
    blocks: {
      required: ['pageId', 'type', 'content'],
      types: {
        pageId: 'string',
        type: 'string',
        content: 'object',
        order: 'number',
        aiGenerated: 'boolean',
        editable: 'boolean',
        version: 'number',
        settings: 'object',
        animations: 'object',
      },
      defaults: {
        order: 0,
        aiGenerated: true,
        editable: true,
        version: 1,
        settings: {},
        animations: {},
      },
    },
    posts: {
      required: ['websiteId', 'title'],
      types: {
        websiteId: 'string',
        title: 'string',
        slug: 'string',
        markdownBody: 'string',
        excerpt: 'string',
        tags: 'array',
        categories: 'array',
        publishedAt: 'date',
        summary: 'string',
        featured: 'boolean',
        featuredImage: 'string',
        author: 'object',
        seoMeta: 'object',
        status: 'string',
        readTime: 'number',
      },
      defaults: {
        tags: [],
        categories: [],
        publishedAt: new Date().toISOString(),
        featured: false,
        status: 'published',
        readTime: 5,
        author: {},
        seoMeta: {},
        excerpt: '',
      },
    },
    products: {
      required: ['websiteId', 'title'],
      types: {
        websiteId: 'string',
        title: 'string',
        slug: 'string',
        imageUrl: 'string',
        gallery: 'array',
        description: 'string',
        shortDescription: 'string',
        price: 'number',
        comparePrice: 'number',
        currency: 'string',
        sku: 'string',
        stock: 'number',
        externalUrl: 'string',
        category: 'string',
        tags: 'array',
        featured: 'boolean',
        status: 'string',
        seoMeta: 'object',
      },
      defaults: {
        price: 0,
        currency: 'USD',
        stock: 0,
        gallery: [],
        tags: [],
        featured: false,
        status: 'active',
        seoMeta: {},
      },
    },
    faqs: {
      required: ['websiteId', 'question', 'answer'],
      types: {
        websiteId: 'string',
        question: 'string',
        answer: 'string',
        aiGenerated: 'boolean',
        category: 'string',
        order: 'number',
        helpful: 'number',
        notHelpful: 'number',
        status: 'string',
      },
      defaults: {
        aiGenerated: true,
        category: 'general',
        order: 0,
        helpful: 0,
        notHelpful: 0,
        status: 'published',
      },
    },
    submissions: {
      required: ['websiteId', 'formId'],
      types: {
        websiteId: 'string',
        formId: 'string',
        dataJson: 'object',
        timestamp: 'date',
        ip: 'string',
        userAgent: 'string',
        referrer: 'string',
        status: 'string',
        spam: 'boolean',
        read: 'boolean',
        tags: 'array',
      },
      defaults: {
        timestamp: new Date().toISOString(),
        status: 'new',
        spam: false,
        read: false,
        tags: [],
      },
    },
    testimonials: {
      required: ['websiteId', 'name', 'content'],
      types: {
        websiteId: 'string',
        name: 'string',
        content: 'string',
        role: 'string',
        company: 'string',
        avatar: 'string',
        rating: 'number',
        featured: 'boolean',
        status: 'string',
        source: 'string',
        date: 'date',
      },
      defaults: {
        rating: 5,
        featured: false,
        status: 'published',
        source: 'manual',
        date: new Date().toISOString(),
      },
    },
    appointments: {
      required: ['websiteId', 'name', 'email', 'service'],
      types: {
        websiteId: 'string',
        name: 'string',
        email: 'string',
        phone: 'string',
        service: 'string',
        date: 'date',
        time: 'string',
        duration: 'number',
        status: 'string',
        notes: 'string',
        confirmationSent: 'boolean',
        reminderSent: 'boolean',
        meetingLink: 'string',
      },
      defaults: {
        duration: 60,
        status: 'pending',
        confirmationSent: false,
        reminderSent: false,
      },
    },
    newsletters: {
      required: ['websiteId', 'email'],
      types: {
        websiteId: 'string',
        email: 'string',
        name: 'string',
        source: 'string',
        tags: 'array',
        subscribed: 'boolean',
        confirmed: 'boolean',
        subscribedAt: 'date',
        unsubscribedAt: 'date',
      },
      defaults: {
        subscribed: true,
        confirmed: false,
        tags: [],
        subscribedAt: new Date().toISOString(),
        source: 'website',
      },
    },
    domains: {
      required: ['websiteId', 'domain'],
      types: {
        websiteId: 'string',
        domain: 'string',
        type: 'string',
        status: 'string',
        ssl: 'boolean',
        verified: 'boolean',
        dnsRecords: 'array',
        provider: 'string',
        registrar: 'string',
        expiresAt: 'date',
        autoRenew: 'boolean',
      },
      defaults: {
        type: 'custom',
        status: 'pending',
        ssl: true,
        verified: false,
        dnsRecords: [],
        autoRenew: true,
      },
    },
    analytics: {
      required: ['websiteId', 'date'],
      types: {
        websiteId: 'string',
        date: 'date',
        pageViews: 'number',
        uniqueVisitors: 'number',
        sessions: 'number',
        bounceRate: 'number',
        avgSessionDuration: 'number',
        topPages: 'array',
        topReferrers: 'array',
        countries: 'array',
        devices: 'array',
        browsers: 'array',
      },
      defaults: {
        pageViews: 0,
        uniqueVisitors: 0,
        sessions: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        topPages: [],
        topReferrers: [],
        countries: [],
        devices: [],
        browsers: [],
      },
    },
    ...enhancedSDKConfig.schemas,
  },
  templates: {
    otp: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAFA; padding: 40px;">
        <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #6366F1; font-size: 24px; font-weight: 600; margin: 0;">mybiz AI</h2>
            <p style="color: #64748B; margin: 8px 0 0 0;">Your AI-powered website builder</p>
          </div>
          <h3 style="color: #0F172A; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Your Verification Code</h3>
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">Your one-time password is:</p>
          <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 20px; text-align: center; font-size: 28px; font-weight: bold; margin: 24px 0; border-radius: 8px; color: white; letter-spacing: 2px;">
            {{otp}}
          </div>
          <p style="color: #64748B; font-size: 14px; text-align: center; margin: 0;">This code will expire in 10 minutes.</p>
        </div>
        <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 20px;">
          © 2024 mybiz AI. All rights reserved.
        </p>
      </div>
    `,
    welcome: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAFA; padding: 40px;">
        <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #6366F1; font-size: 24px; font-weight: 600; margin: 0;">Welcome to mybiz AI!</h2>
            <p style="color: #64748B; margin: 8px 0 0 0;">Your Website. Described, Not Designed.</p>
          </div>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for joining our AI-powered website builder platform. We're excited to help you create a beautiful, 
            functional website by simply describing your business.
          </p>
          <div style="background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); padding: 24px; border-radius: 8px; margin: 24px 0;">
            <h4 style="color: #1E293B; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Get started in 3 simple steps:</h4>
            <ol style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
              <li>Describe your business and target audience</li>
              <li>Let our AI generate your complete website</li>
              <li>Refine and publish with simple prompts</li>
            </ol>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="#" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Create Your First Website
            </a>
          </div>
        </div>
      </div>
    `,
    appointmentConfirmation: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAFA; padding: 40px;">
        <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h3 style="color: #10B981; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Appointment Confirmed!</h3>
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
            Your appointment has been successfully scheduled for <strong>{{date}}</strong> at <strong>{{time}}</strong>.
          </p>
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #166534; margin: 0;"><strong>Service:</strong> {{service}}</p>
            <p style="color: #166534; margin: 8px 0 0 0;"><strong>Duration:</strong> {{duration}} minutes</p>
          </div>
          <p style="color: #64748B; font-size: 14px;">
            You'll receive a reminder 24 hours before your appointment.
          </p>
        </div>
      </div>
    `,
  },
};

// Initialize SDK
export const sdk = new UniversalSDK(sdkConfig);

// Demo mode localStorage fallback
if (!import.meta.env.VITE_GITHUB_TOKEN || import.meta.env.VITE_GITHUB_TOKEN === 'demo-token') {
  console.warn('GitHub not configured, using localStorage for demo');
  
  const originalGet = sdk.get.bind(sdk);
  const originalInsert = sdk.insert.bind(sdk);
  const originalUpdate = sdk.update.bind(sdk);
  const originalDelete = sdk.delete.bind(sdk);

  sdk.get = async function(collection: string): Promise<any[]> {
    try {
      const data = localStorage.getItem(`demo_${collection}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  sdk.insert = async function(collection: string, item: any): Promise<any> {
    const arr = await this.get(collection);
    const id = (Math.max(0, ...arr.map((x: any) => +x.id || 0)) + 1).toString();
    const newItem = { uid: crypto.randomUUID(), id, ...item };
    arr.push(newItem);
    localStorage.setItem(`demo_${collection}`, JSON.stringify(arr));
    return newItem;
  };

  sdk.update = async function(collection: string, key: string, updates: any): Promise<any> {
    const arr = await this.get(collection);
    const i = arr.findIndex((x: any) => x.id === key || x.uid === key);
    if (i < 0) throw new Error("Not found");
    const upd = { ...arr[i], ...updates };
    arr[i] = upd;
    localStorage.setItem(`demo_${collection}`, JSON.stringify(arr));
    return upd;
  };

  sdk.delete = async function(collection: string, key: string): Promise<void> {
    const arr = await this.get(collection);
    const filtered = arr.filter((x: any) => x.id !== key && x.uid !== key);
    localStorage.setItem(`demo_${collection}`, JSON.stringify(filtered));
  };
}

// Initialize SDK on import (with error handling)
sdk.init().catch(error => {
  console.warn('SDK initialization failed, running in demo mode:', error);
});

export default sdk;
export type { User, Session, CloudinaryUploadResult };
