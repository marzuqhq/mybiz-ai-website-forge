
import UniversalSDK, { 
  UniversalSDKConfig, 
  User, 
  Session,
  CloudinaryUploadResult 
} from './UniversalSDK';
import { enhancedSDKConfig } from './enhanced-sdk-config';

// Enhanced SDK Configuration with essential schemas only
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
    // Essential collections only
    blog_posts: {
      required: ['websiteId', 'title', 'content'],
      types: {
        websiteId: 'string',
        title: 'string',
        content: 'string',
        excerpt: 'string',
        slug: 'string',
        status: 'string',
        publishedAt: 'date',
        createdAt: 'date',
        updatedAt: 'date',
        author: 'string',
        tags: 'array',
        featuredImage: 'string',
        seoTitle: 'string',
        seoDescription: 'string',
      },
      defaults: {
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        excerpt: '',
        slug: '',
        author: '',
        featuredImage: '',
        seoTitle: '',
        seoDescription: '',
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

// Simplified SDK with better error handling
class EnhancedSDK extends UniversalSDK {
  private initialized = false;
  private initializingCollections = new Set<string>();
  private retryCount = new Map<string, number>();
  private maxRetries = 3;
  private initializationPromise: Promise<void> | null = null;

  async ensureCollection(collection: string): Promise<void> {
    if (this.initializingCollections.has(collection)) {
      // Wait for ongoing initialization
      while (this.initializingCollections.has(collection)) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return;
    }

    this.initializingCollections.add(collection);
    
    try {
      // Try to get the collection first
      await this.get(collection);
      console.log(`Collection ${collection} already exists`);
    } catch (error: any) {
      // If 404, create the collection file
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log(`Creating collection: ${collection}`);
        try {
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
            const errorText = await response.text();
            if (response.status === 422 && errorText.includes('already exists')) {
              console.log(`Collection ${collection} already exists`);
              return;
            }
            throw new Error(`Failed to create ${collection}: ${response.status} ${errorText}`);
          }
          
          console.log(`Successfully created ${collection}`);
        } catch (createError: any) {
          if (createError.message.includes('already exists')) {
            console.log(`Collection ${collection} already exists`);
            return;
          }
          console.warn(`Failed to create ${collection}:`, createError);
          throw createError;
        }
      } else {
        console.warn(`Error accessing ${collection}:`, error);
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
        
        // Short delay with jitter
        const delay = 500 + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.withRetry(operation, key);
      }
      
      this.retryCount.delete(key);
      throw error;
    }
  }

  async get<T = any>(collection: string): Promise<T[]> {
    if (!this.initialized) {
      await this.initializeEssentialCollections();
    }
    return super.get<T>(collection);
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    if (!this.initialized) {
      await this.initializeEssentialCollections();
    }
    
    return this.withRetry(async () => {
      return super.insert<T>(collection, item);
    }, `insert-${collection}-${Date.now()}`);
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    if (!this.initialized) {
      await this.initializeEssentialCollections();
    }
    
    return this.withRetry(async () => {
      return super.update<T>(collection, key, updates);
    }, `update-${collection}-${key}`);
  }

  async initializeEssentialCollections(): Promise<void> {
    if (this.initialized || this.initializationPromise) {
      return this.initializationPromise || Promise.resolve();
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private async performInitialization(): Promise<void> {
    const schemas = (this as any).schemas;
    // Only initialize essential collections first
    const essentialCollections = ['users', 'websites', 'blog_posts', 'customers'];
    
    console.log('Initializing essential collections:', essentialCollections);

    // Initialize essential collections first
    for (const collection of essentialCollections) {
      try {
        await this.ensureCollection(collection);
        // Small delay between collections to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to initialize essential collection ${collection}:`, error);
      }
    }

    // Then initialize remaining collections in background
    const remainingCollections = Object.keys(schemas || {}).filter(
      c => !essentialCollections.includes(c)
    );
    
    if (remainingCollections.length > 0) {
      console.log('Initializing remaining collections in background:', remainingCollections);
      
      // Initialize remaining collections without blocking
      Promise.all(
        remainingCollections.map(async (collection) => {
          try {
            await this.ensureCollection(collection);
          } catch (error) {
            console.warn(`Failed to initialize ${collection}:`, error);
          }
        })
      ).then(() => {
        console.log('All collections initialized');
      }).catch(error => {
        console.warn('Some collections failed to initialize:', error);
      });
    }

    this.initialized = true;
    console.log('Essential collections initialized successfully');
  }

  // Override login to ensure initialization
  async login(email: string, password: string): Promise<string | { otpRequired: boolean }> {
    console.log('Starting login process for:', email);
    
    try {
      // Ensure essential collections are initialized before login
      await this.initializeEssentialCollections();
      console.log('Collections initialized, proceeding with login');
      
      const result = await super.login(email, password);
      console.log('Login successful');
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Override register to ensure initialization
  async register(email: string, password: string, profile: any = {}): Promise<any> {
    console.log('Starting registration process for:', email);
    
    try {
      // Ensure essential collections are initialized before registration
      await this.initializeEssentialCollections();
      console.log('Collections initialized, proceeding with registration');
      
      const result = await super.register(email, password, profile);
      console.log('Registration successful');
      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
}

// Create the enhanced SDK instance
const sdk = new EnhancedSDK(sdkConfig);

// Test connection on startup
sdk.initializeEssentialCollections().catch(error => {
  console.error('SDK initialization failed:', error);
});

export { sdk };
export default sdk;
export type { User, Session, CloudinaryUploadResult };
