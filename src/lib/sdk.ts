
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
    requireEmailVerification: false,
    otpTriggers: [],
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
        verified: true,
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
    customers: {
      required: ['websiteId', 'email'],
      types: {
        websiteId: 'string',
        email: 'string',
        name: 'string',
        phone: 'string',
        company: 'string',
        status: 'string',
        tags: 'array',
        customFields: 'object',
        createdAt: 'date',
        lastContact: 'date',
      },
      defaults: {
        status: 'active',
        tags: [],
        customFields: {},
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
      },
    },
    orders: {
      required: ['websiteId', 'customerId', 'total'],
      types: {
        websiteId: 'string',
        customerId: 'string',
        orderNumber: 'string',
        items: 'array',
        total: 'number',
        status: 'string',
        paymentStatus: 'string',
        shippingAddress: 'object',
        billingAddress: 'object',
        createdAt: 'date',
        updatedAt: 'date',
      },
      defaults: {
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    invoices: {
      required: ['websiteId', 'customerId', 'total'],
      types: {
        websiteId: 'string',
        customerId: 'string',
        invoiceNumber: 'string',
        items: 'array',
        total: 'number',
        tax: 'number',
        status: 'string',
        dueDate: 'date',
        paidDate: 'date',
        createdAt: 'date',
      },
      defaults: {
        status: 'draft',
        tax: 0,
        createdAt: new Date().toISOString(),
      },
    },
    forms: {
      required: ['websiteId', 'name'],
      types: {
        websiteId: 'string',
        name: 'string',
        fields: 'array',
        settings: 'object',
        submissions: 'array',
        status: 'string',
        createdAt: 'date',
      },
      defaults: {
        fields: [],
        settings: {},
        submissions: [],
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    },
    email_campaigns: {
      required: ['websiteId', 'name', 'subject'],
      types: {
        websiteId: 'string',
        name: 'string',
        subject: 'string',
        content: 'string',
        recipients: 'array',
        status: 'string',
        stats: 'object',
        scheduledAt: 'date',
        sentAt: 'date',
        createdAt: 'date',
      },
      defaults: {
        recipients: [],
        status: 'draft',
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0
        },
        createdAt: new Date().toISOString(),
      },
    },
  },
  templates: {},
};

// Enhanced SDK with improved error handling and retry logic
class EnhancedSDK extends UniversalSDK {
  private initialized = false;
  private initializingCollections = new Set<string>();
  private retryCount = new Map<string, number>();
  private maxRetries = 5;

  async ensureCollection(collection: string): Promise<void> {
    if (this.initializingCollections.has(collection)) {
      // Wait for ongoing initialization
      while (this.initializingCollections.has(collection)) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
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
          const owner = (this as any).owner;
          const repo = (this as any).repo;
          const token = (this as any).token;
          const basePath = (this as any).basePath;
          const branch = (this as any).branch;
          
          const url = `https://api.github.com/repos/${owner}/${repo}/contents/${basePath}/${collection}.json`;
          
          // Add small random delay to avoid race conditions
          await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
          
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
            const errorText = await response.text();
            if (response.status === 422 && errorText.includes('already exists')) {
              console.log(`Collection ${collection} already exists`);
              return;
            }
            throw new Error(`Failed to create ${collection}: ${response.status} ${errorText}`);
          }
          
          console.log(`Successfully initialized ${collection}`);
        } catch (createError: any) {
          if (createError.message.includes('already exists')) {
            console.log(`Collection ${collection} already exists`);
            return;
          }
          console.warn(`Failed to initialize ${collection}:`, createError);
          throw createError;
        }
      } else {
        throw error;
      }
    } finally {
      this.initializingCollections.delete(collection);
    }
  }

  private async withRetry<T>(operation: () => Promise<T>, key: string): Promise<T> {
    const currentRetries = this.retryCount.get(key) || 0;
    
    try {
      const result = await operation();
      this.retryCount.delete(key); // Reset on success
      return result;
    } catch (error: any) {
      if ((error.message.includes('409') || error.message.includes('conflict')) && currentRetries < this.maxRetries) {
        console.log(`Retrying ${key} due to conflict (attempt ${currentRetries + 1}/${this.maxRetries})`);
        this.retryCount.set(key, currentRetries + 1);
        
        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, currentRetries), 5000) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.withRetry(operation, key);
      }
      
      this.retryCount.delete(key);
      throw error;
    }
  }

  async get<T = any>(collection: string): Promise<T[]> {
    await this.ensureCollection(collection);
    return super.get<T>(collection);
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    await this.ensureCollection(collection);
    
    return this.withRetry(async () => {
      return super.insert<T>(collection, item);
    }, `insert-${collection}-${Date.now()}`);
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    await this.ensureCollection(collection);
    
    return this.withRetry(async () => {
      return super.update<T>(collection, key, updates);
    }, `update-${collection}-${key}`);
  }

  async initializeAllCollections(): Promise<void> {
    if (this.initialized) return;

    const schemas = (this as any).schemas;
    const collections = Object.keys(schemas || {});
    console.log('Initializing collections:', collections);

    // Initialize collections sequentially to avoid conflicts
    for (const collection of collections) {
      try {
        await this.ensureCollection(collection);
        // Small delay between collections
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`Failed to initialize ${collection}:`, error);
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
