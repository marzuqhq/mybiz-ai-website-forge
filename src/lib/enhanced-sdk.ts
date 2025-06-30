
import UniversalSDK, { 
  UniversalSDKConfig, 
  User, 
  Session,
  CloudinaryUploadResult 
} from './UniversalSDK';

// Enhanced SDK Configuration
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
        permissions: ['read', 'write'],
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
        content: 'object',
        pages: 'array',
      },
      defaults: {
        status: 'active',
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
        content: {},
        pages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
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
        category: 'string',
      },
      defaults: {
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        excerpt: '',
        slug: '',
        author: '',
        featuredImage: '',
        seoTitle: '',
        seoDescription: '',
        category: 'general',
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
        notes: 'string',
      },
      defaults: {
        status: 'active',
        tags: [],
        customFields: {},
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        notes: '',
      },
    },
    products: {
      required: ['websiteId', 'name', 'price'],
      types: {
        websiteId: 'string',
        name: 'string',
        description: 'string',
        price: 'number',
        category: 'string',
        sku: 'string',
        inventory: 'number',
        images: 'array',
        status: 'string',
        createdAt: 'date',
        updatedAt: 'date',
        features: 'array',
        specifications: 'object',
      },
      defaults: {
        status: 'active',
        inventory: 0,
        images: [],
        features: [],
        specifications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    chat_conversations: {
      required: ['websiteId', 'messages'],
      types: {
        websiteId: 'string',
        userId: 'string',
        sessionId: 'string',
        messages: 'array',
        context: 'object',
        status: 'string',
        createdAt: 'date',
        updatedAt: 'date',
        metadata: 'object',
      },
      defaults: {
        messages: [],
        context: {},
        status: 'active',
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },
  templates: {},
};

class RobustSDK extends UniversalSDK {
  private initPromise: Promise<void> | null = null;
  private retryAttempts = new Map<string, number>();
  private maxRetries = 5;
  private backoffBase = 1000;

  constructor(config: UniversalSDKConfig) {
    super(config);
    console.log('🚀 Initializing Robust SDK...');
  }

  private async exponentialBackoff(attempt: number): Promise<void> {
    const delay = this.backoffBase * Math.pow(2, attempt) + Math.random() * 1000;
    console.log(`⏳ Backing off for ${Math.round(delay)}ms (attempt ${attempt + 1})`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async withRetryLogic<T>(
    operation: () => Promise<T>,
    operationName: string,
    key: string = operationName
  ): Promise<T> {
    const attempts = this.retryAttempts.get(key) || 0;
    
    try {
      const result = await operation();
      this.retryAttempts.delete(key);
      return result;
    } catch (error: any) {
      console.error(`❌ ${operationName} failed (attempt ${attempts + 1}):`, error.message);
      
      const shouldRetry = (
        attempts < this.maxRetries && 
        (error.message.includes('409') || 
         error.message.includes('conflict') ||
         error.message.includes('rate limit') ||
         error.message.includes('timeout') ||
         error.message.includes('ECONNRESET'))
      );

      if (shouldRetry) {
        this.retryAttempts.set(key, attempts + 1);
        await this.exponentialBackoff(attempts);
        return this.withRetryLogic(operation, operationName, key);
      }

      this.retryAttempts.delete(key);
      throw error;
    }
  }

  async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<void> {
    console.log('🔧 Starting SDK initialization...');
    
    // Test basic connection
    await this.withRetryLogic(async () => {
      const response = await fetch(`https://api.github.com/repos/${(this as any).owner}/${(this as any).repo}`, {
        headers: { Authorization: `token ${(this as any).token}` }
      });
      if (!response.ok) {
        throw new Error(`GitHub connection failed: ${response.status}`);
      }
      console.log('✅ GitHub connection verified');
    }, 'GitHub Connection Test');

    // Initialize essential collections with better error handling
    const essentialCollections = ['users', 'websites', 'blog_posts', 'customers', 'products'];
    
    for (const collection of essentialCollections) {
      await this.withRetryLogic(async () => {
        await this.ensureCollection(collection);
        console.log(`✅ Collection ${collection} ready`);
      }, `Initialize ${collection}`, `init-${collection}`);
      
      // Small delay between collections
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('🎉 SDK initialization complete!');
  }

  private async ensureCollection(collection: string): Promise<void> {
    try {
      await super.get(collection);
    } catch (error: any) {
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.log(`📝 Creating collection: ${collection}`);
        await this.createCollection(collection);
      } else {
        throw error;
      }
    }
  }

  private async createCollection(collection: string): Promise<void> {
    const url = `https://api.github.com/repos/${(this as any).owner}/${(this as any).repo}/contents/${(this as any).basePath}/${collection}.json`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${(this as any).token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Initialize ${collection} collection`,
        content: btoa(JSON.stringify([], null, 2)),
        branch: (this as any).branch,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 422 && errorText.includes('already exists')) {
        console.log(`ℹ️ Collection ${collection} already exists`);
        return;
      }
      throw new Error(`Failed to create ${collection}: ${response.status} ${errorText}`);
    }
  }

  // Override core methods with initialization check
  async get<T = any>(collection: string): Promise<T[]> {
    await this.ensureInitialized();
    return this.withRetryLogic(
      () => super.get<T>(collection),
      `Get ${collection}`,
      `get-${collection}`
    );
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    await this.ensureInitialized();
    return this.withRetryLogic(
      () => super.insert<T>(collection, item),
      `Insert into ${collection}`,
      `insert-${collection}-${Date.now()}`
    );
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    await this.ensureInitialized();
    return this.withRetryLogic(
      () => super.update<T>(collection, key, updates),
      `Update ${collection}`,
      `update-${collection}-${key}`
    );
  }

  async login(email: string, password: string): Promise<string | { otpRequired: boolean }> {
    console.log('🔐 Attempting login for:', email);
    await this.ensureInitialized();
    
    return this.withRetryLogic(async () => {
      const result = await super.login(email, password);
      console.log('✅ Login successful');
      return result;
    }, 'User Login', `login-${email}`);
  }

  async register(email: string, password: string, profile: any = {}): Promise<any> {
    console.log('📝 Attempting registration for:', email);
    await this.ensureInitialized();
    
    return this.withRetryLogic(async () => {
      const result = await super.register(email, password, profile);
      console.log('✅ Registration successful');
      return result;
    }, 'User Registration', `register-${email}`);
  }
}

// Create and export the enhanced SDK
const sdk = new RobustSDK(sdkConfig);

export { sdk };
export default sdk;
export type { User, Session, CloudinaryUploadResult };
