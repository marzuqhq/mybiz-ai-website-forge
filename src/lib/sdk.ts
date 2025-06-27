
import UniversalSDK, { 
  UniversalSDKConfig, 
  User, 
  Session,
  CloudinaryUploadResult 
} from './UniversalSDK';

// SDK Configuration
const sdkConfig: UniversalSDKConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER || '',
  repo: import.meta.env.VITE_GITHUB_REPO || '',
  token: import.meta.env.VITE_GITHUB_TOKEN || '',
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
    requireEmailVerification: true,
    otpTriggers: ['register', 'login'],
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
      },
      defaults: {
        verified: false,
        roles: ['user'],
        permissions: ['read'],
      },
    },
    websites: {
      required: ['userId', 'name'],
      types: {
        userId: 'string',
        name: 'string',
        domain: 'string',
        theme: 'object',
        seoConfig: 'object',
        status: 'string',
        businessInfo: 'object',
      },
      defaults: {
        status: 'draft',
        theme: {
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          fontFamily: 'Inter',
        },
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
      },
      defaults: {
        type: 'page',
        blocks: [],
        seoMeta: {},
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
      },
      defaults: {
        order: 0,
        aiGenerated: true,
        editable: true,
      },
    },
    posts: {
      required: ['websiteId', 'title'],
      types: {
        websiteId: 'string',
        title: 'string',
        slug: 'string',
        markdownBody: 'string',
        tags: 'array',
        publishedAt: 'date',
        summary: 'string',
      },
      defaults: {
        tags: [],
        publishedAt: new Date().toISOString(),
      },
    },
    products: {
      required: ['websiteId', 'title'],
      types: {
        websiteId: 'string',
        title: 'string',
        slug: 'string',
        imageUrl: 'string',
        description: 'string',
        price: 'number',
        externalUrl: 'string',
      },
      defaults: {
        price: 0,
      },
    },
    faqs: {
      required: ['websiteId', 'question', 'answer'],
      types: {
        websiteId: 'string',
        question: 'string',
        answer: 'string',
        aiGenerated: 'boolean',
      },
      defaults: {
        aiGenerated: true,
      },
    },
    submissions: {
      required: ['websiteId', 'formId'],
      types: {
        websiteId: 'string',
        formId: 'string',
        dataJson: 'object',
        timestamp: 'date',
      },
      defaults: {
        timestamp: new Date().toISOString(),
      },
    },
  },
  templates: {
    otp: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Verification Code</h2>
        <p>Your one-time password is:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
          {{otp}}
        </div>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `,
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to MyBiz AI!</h2>
        <p>Thank you for joining our AI-powered website builder platform.</p>
        <p>Get started by describing your business and let our AI create your perfect website.</p>
      </div>
    `,
  },
};

// Initialize SDK
export const sdk = new UniversalSDK(sdkConfig);

// Initialize SDK on import
sdk.init().catch(console.error);

export default sdk;
export type { User, Session, CloudinaryUploadResult };
