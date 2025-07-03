
// Universal SDK for GitHub-based database operations
import { Octokit } from '@octokit/rest';

export interface UniversalSDKConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
  basePath?: string;
  mediaPath?: string;
  cloudinary?: {
    cloudName: string;
    uploadPreset: string;
  };
  smtp?: {
    endpoint: string;
    from: string;
  };
  auth?: {
    requireEmailVerification: boolean;
    otpTriggers: string[];
  };
  schemas?: Record<string, SchemaDefinition>;
  templates?: Record<string, any>;
}

export interface SchemaDefinition {
  required: string[];
  types: Record<string, string>;
  defaults: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  verified: boolean;
  roles: string[];
  permissions: string[];
  plan: string;
  authMethod: string;
  createdAt: string;
  profile: Record<string, any>;
  subdomain: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  metadata: Record<string, any>;
}

export interface SessionWithUser extends Session {
  user: User;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

class UniversalSDK {
  private octokit: Octokit;
  private config: UniversalSDKConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private sessions: Map<string, SessionWithUser> = new Map();

  constructor(config: UniversalSDKConfig) {
    this.config = {
      branch: 'main',
      basePath: 'db',
      mediaPath: 'media',
      ...config,
    };

    this.octokit = new Octokit({
      auth: this.config.token,
    });
  }

  // Enhanced error handling and retry logic
  async withRetryLogic<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.log(`❌ Operation failed (attempt ${attempt}): ${error.message}`);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw lastError!;
  }

  // Safe base64 encoding for Unicode content
  private safeBase64Encode(content: string): string {
    try {
      // First convert to UTF-8 bytes, then encode
      const utf8Bytes = new TextEncoder().encode(content);
      let binary = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binary += String.fromCharCode(utf8Bytes[i]);
      }
      return btoa(binary);
    } catch (error) {
      console.error('Base64 encoding error:', error);
      // Fallback: remove non-ASCII characters
      const cleanContent = content.replace(/[^\x00-\x7F]/g, "");
      return btoa(cleanContent);
    }
  }

  // Get collection with proper error handling and caching
  async get(collection: string): Promise<any[]> {
    const cached = this.cache.get(collection);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const filePath = `${this.config.basePath}/${collection}.json`;
      
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: filePath,
        ref: this.config.branch,
      });

      if ('content' in response.data) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        const data = JSON.parse(content);
        
        // Cache the result
        this.cache.set(collection, { data, timestamp: Date.now() });
        return data;
      }
      
      return [];
    } catch (error: any) {
      if (error.status === 404) {
        console.log(`Collection ${collection} not found, creating empty collection`);
        await this.saveCollection(collection, []);
        return [];
      }
      console.error(`Error loading ${collection}:`, error.message);
      return [];
    }
  }

  // Get single item by ID
  async getItem(collection: string, id: string): Promise<any | null> {
    const data = await this.get(collection);
    return data.find(item => item.id === id) || null;
  }

  // Check if slug is available
  async isSlugAvailable(slug: string, collection: string = 'websites'): Promise<boolean> {
    const data = await this.get(collection);
    return !data.some(item => item.slug === slug);
  }

  // Enhanced save collection with SHA conflict resolution
  async saveCollection(collection: string, data: any[]): Promise<void> {
    const filePath = `${this.config.basePath}/${collection}.json`;
    const content = JSON.stringify(data, null, 2);
    const encodedContent = this.safeBase64Encode(content);

    return this.withRetryLogic(async () => {
      try {
        // Get current file to get SHA
        let currentSha: string | undefined;
        try {
          const currentFile = await this.octokit.rest.repos.getContent({
            owner: this.config.owner,
            repo: this.config.repo,
            path: filePath,
            ref: this.config.branch,
          });

          if ('sha' in currentFile.data) {
            currentSha = currentFile.data.sha;
          }
        } catch (error: any) {
          if (error.status !== 404) {
            throw error;
          }
          // File doesn't exist, we'll create it
        }

        // Save with current SHA
        await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: this.config.owner,
          repo: this.config.repo,
          path: filePath,
          message: `Update ${collection}`,
          content: encodedContent,
          branch: this.config.branch,
          ...(currentSha && { sha: currentSha }),
        });

        // Clear cache after successful save
        this.cache.delete(collection);
        
        console.log(`✅ Successfully saved ${collection}`);
      } catch (error: any) {
        console.error(`Error saving ${collection}:`, error);
        throw error;
      }
    }, 5, 2000);
  }

  // Schema validation
  validateSchema(collection: string, data: any): void {
    const schema = this.config.schemas?.[collection];
    if (!schema) return;

    // Check required fields
    for (const field of schema.required) {
      if (!(field in data) || data[field] === undefined || data[field] === null || data[field] === '') {
        throw new Error(`Required field '${field}' is missing`);
      }
    }

    // Apply defaults for missing optional fields
    for (const [field, defaultValue] of Object.entries(schema.defaults)) {
      if (!(field in data) || data[field] === undefined) {
        data[field] = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      }
    }
  }

  // Enhanced insert with conflict resolution
  async insert(collection: string, data: any): Promise<any> {
    return this.withRetryLogic(async () => {
      // Generate ID if not provided
      if (!data.id) {
        data.id = this.generateId();
      }

      // Validate schema
      this.validateSchema(collection, data);

      // Get current data with fresh fetch
      this.cache.delete(collection); // Force fresh data
      const currentData = await this.get(collection);
      
      // Add new item
      currentData.push(data);
      
      // Save updated data
      await this.saveCollection(collection, currentData);
      
      return data;
    }, 5, 2000);
  }

  // Enhanced update with conflict resolution
  async update(collection: string, id: string, updates: any): Promise<any> {
    return this.withRetryLogic(async () => {
      // Get current data with fresh fetch
      this.cache.delete(collection); // Force fresh data
      const currentData = await this.get(collection);
      
      const index = currentData.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`Item with id ${id} not found in ${collection}`);
      }

      // Update item
      const updatedItem = { ...currentData[index], ...updates };
      
      // Validate schema for updated item
      this.validateSchema(collection, updatedItem);
      
      currentData[index] = updatedItem;
      
      // Save updated data
      await this.saveCollection(collection, currentData);
      
      return updatedItem;
    }, 5, 2000);
  }

  // Delete with conflict resolution
  async delete(collection: string, id: string): Promise<boolean> {
    return this.withRetryLogic(async () => {
      // Get current data with fresh fetch
      this.cache.delete(collection); // Force fresh data
      const currentData = await this.get(collection);
      
      const index = currentData.findIndex(item => item.id === id);
      if (index === -1) {
        return false;
      }

      currentData.splice(index, 1);
      
      // Save updated data
      await this.saveCollection(collection, currentData);
      
      return true;
    }, 5, 2000);
  }

  // Find by criteria
  async find(collection: string, criteria: Record<string, any>): Promise<any[]> {
    const data = await this.get(collection);
    return data.filter(item => {
      return Object.entries(criteria).every(([key, value]) => item[key] === value);
    });
  }

  // Find one by criteria
  async findOne(collection: string, criteria: Record<string, any>): Promise<any | null> {
    const results = await this.find(collection, criteria);
    return results.length > 0 ? results[0] : null;
  }

  // Generate unique ID
  generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Generate unique slug
  async generateUniqueSlug(baseSlug: string, collection: string = 'websites'): Promise<string> {
    const existingData = await this.get(collection);
    let slug = baseSlug;
    let counter = 1;

    while (existingData.some(item => item.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // Authentication methods
  async login(email: string, password: string): Promise<string | { otpRequired: boolean }> {
    const users = await this.get('users');
    const user = users.find((u: User) => u.email === email);
    
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Generate session token
    const token = this.generateId();
    const session: SessionWithUser = {
      id: this.generateId(),
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      metadata: {},
      user
    };

    this.sessions.set(token, session);
    return token;
  }

  async register(email: string, password: string, profile: any = {}): Promise<User> {
    const users = await this.get('users');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: this.generateId(),
      email,
      password,
      verified: true,
      roles: profile.roles || ['user'],
      permissions: profile.permissions || ['read', 'write'],
      plan: profile.plan || 'free',
      authMethod: 'email',
      createdAt: new Date().toISOString(),
      profile: profile,
      subdomain: profile.subdomain || ''
    };

    await this.insert('users', newUser);
    return newUser;
  }

  getSession(token: string): SessionWithUser | null {
    return this.sessions.get(token) || null;
  }

  destroySession(token: string): void {
    this.sessions.delete(token);
  }

  async verifyLoginOTP(email: string, otp: string): Promise<string> {
    // For now, just simulate OTP verification
    const users = await this.get('users');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Generate session token
    const token = this.generateId();
    const session: SessionWithUser = {
      id: this.generateId(),
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      metadata: {},
      user
    };

    this.sessions.set(token, session);
    return token;
  }

  async requestPasswordReset(email: string): Promise<void> {
    const users = await this.get('users');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // In a real implementation, this would send an email
    console.log(`Password reset requested for ${email}`);
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const users = await this.get('users');
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Update password
    await this.update('users', user.id, { password: newPassword });
  }

  // Media upload to Cloudinary
  async uploadMedia(file: File): Promise<CloudinaryUploadResult> {
    if (!this.config.cloudinary) {
      throw new Error('Cloudinary configuration not provided');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.config.cloudinary.uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.config.cloudinary.cloudName}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload media');
    }

    return response.json();
  }

  // Send email via SMTP endpoint
  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    if (!this.config.smtp) {
      throw new Error('SMTP configuration not provided');
    }

    try {
      const response = await fetch(this.config.smtp.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          html,
          text,
          from: this.config.smtp.from,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export default UniversalSDK;
