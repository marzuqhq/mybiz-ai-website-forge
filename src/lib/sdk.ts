
import UniversalSDK, { 
  UniversalSDKConfig, 
  User, 
  Session,
  CloudinaryUploadResult 
} from './UniversalSDK';
import { enhancedSDKConfig } from './enhanced-sdk-config';

// Enhanced SDK Configuration with all required schemas
const sdkConfig: UniversalSDKConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER || 'ridwanullahh',
  repo: import.meta.env.VITE_GITHUB_REPO || 'mybizaidb',
  token: import.meta.env.VITE_GITHUB_TOKEN || 'demo-token',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
  basePath: 'db',
  mediaPath: 'media',
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  },
  smtp: {
    endpoint: '/api/send-email',
    from: import.meta.env.VITE_SMTP_FROM || 'noreply@mybiz.ai',
  },
  auth: {
    requireEmailVerification: true,
    otpTriggers: ['register', 'login'],
  },
  schemas: {
    ...enhancedSDKConfig.schemas,
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
        subdomain: 'string',
      },
      defaults: {
        verified: false,
        roles: ['user'],
        permissions: ['read'],
        plan: 'free',
        authMethod: 'email',
        createdAt: new Date().toISOString(),
        profile: {},
        subdomain: '',
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
        subdomainPath: 'string',
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
        subdomainPath: '',
      },
    },
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
  },
};

// Enhanced SDK with automatic file initialization
class EnhancedSDK extends UniversalSDK {
  private initialized = false;
  private initializingCollections = new Set<string>();

  async ensureCollection(collection: string): Promise<void> {
    if (this.initializingCollections.has(collection)) {
      return;
    }

    this.initializingCollections.add(collection);
    
    try {
      // Try to get the collection first
      await this.get(collection);
    } catch (error: any) {
      // If 404, create the collection file
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log(`Initializing collection: ${collection}`);
        try {
          // Use the public GitHub API directly with properties from config
          const owner = (this as any).owner;
          const repo = (this as any).repo;
          const token = (this as any).token;
          const basePath = (this as any).basePath;
          const branch = (this as any).branch;
          
          const url = `https://api.github.com/repos/${owner}/${repo}/contents/${basePath}/${collection}.json`;
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `Initialize ${collection} collection`,
              content: btoa(JSON.stringify([], null, 2)),
              branch: branch,
            }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to create ${collection}: ${response.statusText}`);
          }
          
          console.log(`Successfully initialized ${collection}`);
        } catch (createError: any) {
          console.warn(`Failed to initialize ${collection}:`, createError);
        }
      }
    } finally {
      this.initializingCollections.delete(collection);
    }
  }

  async get<T = any>(collection: string): Promise<T[]> {
    await this.ensureCollection(collection);
    return super.get<T>(collection);
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    await this.ensureCollection(collection);
    
    // Retry logic for 409 conflicts
    let retries = 3;
    while (retries > 0) {
      try {
        return await super.insert<T>(collection, item);
      } catch (error: any) {
        if (error.message.includes('409') && retries > 1) {
          console.log(`Retrying insert for ${collection} due to SHA conflict...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries--;
          continue;
        }
        throw error;
      }
    }
    throw new Error(`Failed to insert after retries in ${collection}`);
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    await this.ensureCollection(collection);
    
    // Retry logic for 409 conflicts
    let retries = 3;
    while (retries > 0) {
      try {
        return await super.update<T>(collection, key, updates);
      } catch (error: any) {
        if (error.message.includes('409') && retries > 1) {
          console.log(`Retrying update for ${collection} due to SHA conflict...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          retries--;
          continue;
        }
        throw error;
      }
    }
    throw new Error(`Failed to update after retries in ${collection}`);
  }

  async initializeAllCollections(): Promise<void> {
    if (this.initialized) return;

    const schemas = (this as any).schemas;
    const collections = Object.keys(schemas || {});
    console.log('Initializing collections:', collections);

    // Initialize collections in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < collections.length; i += batchSize) {
      const batch = collections.slice(i, i + batchSize);
      await Promise.all(batch.map(collection => this.ensureCollection(collection)));
      // Small delay between batches
      if (i + batchSize < collections.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    this.initialized = true;
    console.log('All collections initialized successfully');
  }
}

// Create the enhanced SDK instance
const sdk = new EnhancedSDK(sdkConfig);

// Initialize all collections on startup
sdk.initializeAllCollections().catch(error => {
  console.warn('Collection initialization failed:', error);
});

export { sdk };
export default sdk;
export type { User, Session, CloudinaryUploadResult };
