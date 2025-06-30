
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
        slug: 'string',
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
        publicUrl: 'string',
      },
      defaults: {
        status: 'active',
        slug: '',
        publicUrl: '',
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
    pages: {
      required: ['websiteId', 'title'],
      types: {
        websiteId: 'string',
        title: 'string',
        slug: 'string',
        type: 'string',
        blocks: 'array',
        seoMeta: 'object',
        status: 'string',
        createdAt: 'date',
        updatedAt: 'date',
      },
      defaults: {
        slug: '',
        type: 'page',
        blocks: [],
        seoMeta: {},
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    blocks: {
      required: ['pageId', 'type'],
      types: {
        pageId: 'string',
        type: 'string',
        content: 'object',
        order: 'number',
        aiGenerated: 'boolean',
        editable: 'boolean',
        createdAt: 'date',
        updatedAt: 'date',
      },
      defaults: {
        content: {},
        order: 0,
        aiGenerated: false,
        editable: true,
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
    posts: {
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
    faqs: {
      required: ['websiteId', 'question', 'answer'],
      types: {
        websiteId: 'string',
        question: 'string',
        answer: 'string',
        category: 'string',
        status: 'string',
        order: 'number',
        tags: 'array',
        createdAt: 'date',
        updatedAt: 'date',
      },
      defaults: {
        category: 'general',
        status: 'published',
        order: 0,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
        source: 'string',
      },
      defaults: {
        status: 'active',
        tags: [],
        customFields: {},
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString(),
        notes: '',
        source: 'manual',
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
        slug: 'string',
      },
      defaults: {
        status: 'active',
        inventory: 0,
        images: [],
        features: [],
        specifications: {},
        slug: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    email_campaigns: {
      required: ['websiteId', 'subject', 'content'],
      types: {
        websiteId: 'string',
        subject: 'string',
        content: 'string',
        status: 'string',
        type: 'string',
        scheduledAt: 'date',
        sentAt: 'date',
        createdAt: 'date',
        updatedAt: 'date',
        recipients: 'array',
        metrics: 'object',
        alternativeSubjects: 'array',
      },
      defaults: {
        status: 'draft',
        type: 'promotional',
        recipients: [],
        metrics: { sent: 0, opened: 0, clicked: 0 },
        alternativeSubjects: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    invoices: {
      required: ['websiteId', 'invoiceNumber', 'clientEmail', 'items', 'total'],
      types: {
        websiteId: 'string',
        invoiceNumber: 'string',
        clientEmail: 'string',
        clientName: 'string',
        clientAddress: 'string',
        items: 'array',
        subtotal: 'number',
        tax: 'number',
        total: 'number',
        status: 'string',
        dueDate: 'date',
        createdAt: 'date',
        updatedAt: 'date',
        paidAt: 'date',
        notes: 'string',
      },
      defaults: {
        status: 'draft',
        subtotal: 0,
        tax: 0,
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    forms: {
      required: ['websiteId', 'name', 'fields'],
      types: {
        websiteId: 'string',
        name: 'string',
        fields: 'array',
        settings: 'object',
        submissions: 'array',
        status: 'string',
        createdAt: 'date',
        updatedAt: 'date',
        slug: 'string',
      },
      defaults: {
        fields: [],
        settings: {
          submitMessage: 'Thank you for your submission!',
          emailNotification: false,
          notificationEmail: '',
          redirectUrl: '',
        },
        submissions: [],
        status: 'active',
        slug: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
    form_submissions: {
      required: ['formId', 'data'],
      types: {
        formId: 'string',
        data: 'object',
        ipAddress: 'string',
        userAgent: 'string',
        createdAt: 'date',
        status: 'string',
      },
      defaults: {
        status: 'new',
        createdAt: new Date().toISOString(),
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
    business_tools: {
      required: ['name', 'category', 'description'],
      types: {
        name: 'string',
        category: 'string',
        description: 'string',
        icon: 'string',
        component: 'string',
        features: 'array',
        status: 'string',
        isPremium: 'boolean',
        createdAt: 'date',
      },
      defaults: {
        status: 'active',
        isPremium: false,
        features: [],
        createdAt: new Date().toISOString(),
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
    const essentialCollections = [
      'users', 'websites', 'pages', 'blocks', 'blog_posts', 'posts', 'faqs', 
      'customers', 'products', 'email_campaigns', 'invoices', 'forms', 
      'form_submissions', 'chat_conversations', 'business_tools'
    ];
    
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

  // Check if slug is available
  async isSlugAvailable(slug: string): Promise<boolean> {
    try {
      const websites = await this.get('websites');
      return !websites.some((w: any) => w.slug === slug);
    } catch (error) {
      console.error('Error checking slug availability:', error);
      return false;
    }
  }

  // Generate unique slug
  async generateUniqueSlug(baseName: string): Promise<string> {
    let slug = baseName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    let counter = 1;
    let originalSlug = slug;
    
    while (!(await this.isSlugAvailable(slug))) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }
    
    return slug;
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

  async delete<T = any>(collection: string, key: string): Promise<void> {
    await this.ensureInitialized();
    return this.withRetryLogic(
      () => super.delete(collection, key),
      `Delete from ${collection}`,
      `delete-${collection}-${key}`
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
