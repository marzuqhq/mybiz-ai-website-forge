
interface UniversalSDKConfig {
  owner: string;
  repo: string;
  token: string;
  branch: string;
  basePath: string;
  mediaPath: string;
  cloudinary?: {
    cloudName?: string;
    uploadPreset?: string;
  };
  smtp?: {
    endpoint: string;
    from: string;
  };
  auth?: {
    requireEmailVerification: boolean;
    otpTriggers: string[];
  };
  schemas: Record<string, {
    required: string[];
    types: Record<string, string>;
    defaults: Record<string, any>;
  }>;
  templates: Record<string, any>;
}

interface User {
  id: string;
  email: string;
  verified: boolean;
  roles: string[];
  permissions: string[];
  plan: string;
  profile: any;
  createdAt: string;
  subdomain?: string;
}

interface Session {
  token: string;
  user: User;
  expiresAt: string;
}

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
}

class UniversalSDK {
  private owner: string;
  private repo: string;
  private token: string;
  private branch: string;
  private basePath: string;
  private mediaPath: string;
  private cloudinary: { cloudName?: string; uploadPreset?: string };
  private smtp: { endpoint: string; from: string };
  private auth: { requireEmailVerification: boolean; otpTriggers: string[] };
  private schemas: Record<string, any>;
  private templates: Record<string, any>;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 30000; // 30 seconds

  constructor(config: UniversalSDKConfig) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.token = config.token;
    this.branch = config.branch;
    this.basePath = config.basePath;
    this.mediaPath = config.mediaPath;
    this.cloudinary = config.cloudinary || {};
    this.smtp = config.smtp || { endpoint: '/api/send-email', from: 'noreply@example.com' };
    this.auth = config.auth || { requireEmailVerification: false, otpTriggers: [] };
    this.schemas = config.schemas || {};
    this.templates = config.templates || {};
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateUID(): string {
    return 'uid_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private validateSchema<T>(collection: string, item: Partial<T>): T {
    const schema = this.schemas[collection];
    if (!schema) {
      console.warn(`Schema not defined for ${collection}, using item as-is`);
      return item as T;
    }

    const validated: any = { ...schema.defaults };
    
    // Check required fields
    for (const field of schema.required) {
      if (!(field in item) || item[field as keyof typeof item] === undefined) {
        throw new Error(`Required field '${field}' is missing`);
      }
      validated[field] = item[field as keyof typeof item];
    }

    // Add other provided fields
    for (const [key, value] of Object.entries(item)) {
      if (value !== undefined) {
        validated[key] = value;
      }
    }

    return validated;
  }

  private getCacheKey(collection: string, key?: string): string {
    return key ? `${collection}:${key}` : collection;
  }

  private setCache(cacheKey: string, data: any): void {
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
  }

  private getCache(cacheKey: string): any | null {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(cacheKey);
    return null;
  }

  async get<T = any>(collection: string): Promise<T[]> {
    const cacheKey = this.getCacheKey(collection);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.basePath}/${collection}.json?ref=${this.branch}`;
      const response = await fetch(url, {
        headers: { Authorization: `token ${this.token}` }
      });

      if (response.status === 404) {
        console.log(`Collection ${collection} not found, creating empty collection`);
        await this.createCollection(collection);
        return [];
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const content = JSON.parse(atob(data.content));
      this.setCache(cacheKey, content);
      return content;
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
      return [];
    }
  }

  private async createCollection(collection: string): Promise<void> {
    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.basePath}/${collection}.json`;
      
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Initialize ${collection} collection`,
          content: btoa(JSON.stringify([], null, 2)),
          branch: this.branch,
        }),
      });
    } catch (error) {
      console.error(`Failed to create collection ${collection}:`, error);
    }
  }

  async insert<T = any>(collection: string, item: Partial<T>): Promise<T & { id: string; uid: string }> {
    try {
      const items = await this.get<T>(collection);
      const validated = this.validateSchema<T>(collection, item);
      const newItem = {
        ...validated,
        id: this.generateId(),
        uid: this.generateUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedItems = [...items, newItem];
      await this.saveCollection(collection, updatedItems);
      
      // Update cache
      const cacheKey = this.getCacheKey(collection);
      this.setCache(cacheKey, updatedItems);
      
      return newItem;
    } catch (error) {
      console.error(`Error inserting into ${collection}:`, error);
      throw error;
    }
  }

  async update<T = any>(collection: string, key: string, updates: Partial<T>): Promise<T> {
    try {
      const items = await this.get<T>(collection);
      const index = items.findIndex((item: any) => item.id === key || item.uid === key);
      
      if (index === -1) {
        throw new Error(`Item with key ${key} not found`);
      }

      const updatedItem = {
        ...items[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      items[index] = updatedItem;
      await this.saveCollection(collection, items);
      
      // Update cache
      const cacheKey = this.getCacheKey(collection);
      this.setCache(cacheKey, items);
      
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${collection}:`, error);
      throw error;
    }
  }

  async delete<T = any>(collection: string, key: string): Promise<void> {
    try {
      const items = await this.get<T>(collection);
      const filteredItems = items.filter((item: any) => item.id !== key && item.uid !== key);
      
      await this.saveCollection(collection, filteredItems);
      
      // Update cache
      const cacheKey = this.getCacheKey(collection);
      this.setCache(cacheKey, filteredItems);
    } catch (error) {
      console.error(`Error deleting from ${collection}:`, error);
      throw error;
    }
  }

  private async saveCollection(collection: string, items: any[]): Promise<void> {
    try {
      const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.basePath}/${collection}.json`;
      
      // Get current file to get SHA
      const currentResponse = await fetch(`${url}?ref=${this.branch}`, {
        headers: { Authorization: `token ${this.token}` }
      });

      let sha: string | undefined;
      if (currentResponse.ok) {
        const currentData = await currentResponse.json();
        sha = currentData.sha;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update ${collection} collection`,
          content: btoa(JSON.stringify(items, null, 2)),
          branch: this.branch,
          ...(sha && { sha }),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error(`Error saving ${collection}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<string | { otpRequired: boolean }> {
    try {
      const users = await this.get<User>('users');
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Simple password check (in production, use proper hashing)
      if ((user as any).password !== password) {
        throw new Error('Invalid password');
      }

      const token = this.generateUID();
      const session: Session = {
        token,
        user,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };

      // Store session (in production, use secure storage)
      localStorage.setItem('session', JSON.stringify(session));
      
      return token;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email: string, password: string, profile: any = {}): Promise<User> {
    try {
      const users = await this.get<User>('users');
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser = await this.insert<User>('users', {
        email,
        password, // In production, hash this
        profile,
        verified: true,
        roles: ['user'],
        permissions: ['read', 'write'],
        plan: 'free',
        createdAt: new Date().toISOString(),
      });

      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    try {
      const sessionData = localStorage.getItem('session');
      if (!sessionData) return null;
      
      const session: Session = JSON.parse(sessionData);
      if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem('session');
        return null;
      }
      
      return session.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('session');
  }

  // File upload methods
  async uploadFile(file: File): Promise<CloudinaryUploadResult> {
    if (!this.cloudinary.cloudName || !this.cloudinary.uploadPreset) {
      throw new Error('Cloudinary not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinary.uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  // Email methods
  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      const response = await fetch(this.smtp.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          content,
          from: this.smtp.from,
        }),
      });

      if (!response.ok) {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }
}

export default UniversalSDK;
export type { UniversalSDKConfig, User, Session, CloudinaryUploadResult };
