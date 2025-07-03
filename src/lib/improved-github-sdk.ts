
import { Octokit } from '@octokit/rest';

interface ImprovedSDKConfig {
  owner: string;
  repo: string;
  token: string;
  branch?: string;
  basePath?: string;
}

class ImprovedGitHubSDK {
  private octokit: Octokit;
  private config: ImprovedSDKConfig;
  private cache: Map<string, { data: any; timestamp: number; sha?: string }> = new Map();
  private readonly CACHE_TTL = 30 * 1000; // 30 seconds cache
  private operationQueue: Map<string, Promise<any>> = new Map();

  constructor(config: ImprovedSDKConfig) {
    this.config = {
      branch: 'main',
      basePath: 'db',
      ...config,
    };

    this.octokit = new Octokit({
      auth: this.config.token,
    });
  }

  // Queue operations to prevent concurrent writes to same file
  private async queueOperation<T>(key: string, operation: () => Promise<T>): Promise<T> {
    if (this.operationQueue.has(key)) {
      await this.operationQueue.get(key);
    }

    const promise = operation();
    this.operationQueue.set(key, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.operationQueue.delete(key);
    }
  }

  // Get with improved caching and SHA tracking
  async get(collection: string): Promise<any[]> {
    const cacheKey = collection;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data;
    }

    return this.queueOperation(`read_${collection}`, async () => {
      try {
        const filePath = `${this.config.basePath}/${collection}.json`;
        
        const response = await this.octokit.rest.repos.getContent({
          owner: this.config.owner,
          repo: this.config.repo,
          path: filePath,
          ref: this.config.branch,
        });

        if ('content' in response.data) {
          const content = atob(response.data.content);
          const data = JSON.parse(content);
          
          // Cache with SHA for future updates
          this.cache.set(cacheKey, { 
            data, 
            timestamp: Date.now(),
            sha: response.data.sha 
          });
          
          return data;
        }
        
        return [];
      } catch (error: any) {
        if (error.status === 404) {
          console.log(`Collection ${collection} not found, creating empty collection`);
          const emptyData: any[] = [];
          await this.saveCollection(collection, emptyData);
          return emptyData;
        }
        console.error(`Error loading ${collection}:`, error.message);
        return [];
      }
    });
  }

  // Improved save with better conflict resolution
  async saveCollection(collection: string, data: any[]): Promise<void> {
    const cacheKey = collection;
    
    return this.queueOperation(`write_${collection}`, async () => {
      const filePath = `${this.config.basePath}/${collection}.json`;
      const content = JSON.stringify(data, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(content)));

      let attempt = 0;
      const maxAttempts = 3;

      while (attempt < maxAttempts) {
        try {
          // Get current SHA
          let currentSha: string | undefined;
          const cached = this.cache.get(cacheKey);
          
          if (cached?.sha) {
            currentSha = cached.sha;
          } else {
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
            }
          }

          // Attempt to save
          const result = await this.octokit.rest.repos.createOrUpdateFileContents({
            owner: this.config.owner,
            repo: this.config.repo,
            path: filePath,
            message: `Update ${collection} - ${new Date().toISOString()}`,
            content: encodedContent,
            branch: this.config.branch,
            ...(currentSha && { sha: currentSha }),
          });

          // Update cache with new SHA
          this.cache.set(cacheKey, { 
            data, 
            timestamp: Date.now(),
            sha: result.data.content?.sha 
          });

          console.log(`✅ Successfully saved ${collection}`);
          return;

        } catch (error: any) {
          attempt++;
          
          if (error.status === 409 || error.message?.includes('sha')) {
            console.log(`SHA conflict on attempt ${attempt}, refreshing and retrying...`);
            
            // Clear cache to force fresh fetch
            this.cache.delete(cacheKey);
            
            if (attempt < maxAttempts) {
              // Wait briefly before retry
              await new Promise(resolve => setTimeout(resolve, 500 * attempt));
              continue;
            }
          }
          
          throw error;
        }
      }
    });
  }

  // Optimized insert with immediate consistency
  async insert(collection: string, data: any): Promise<any> {
    if (!data.id) {
      data.id = this.generateId();
    }

    // Get current data
    const currentData = await this.get(collection);
    
    // Add new item
    const newData = [...currentData, data];
    
    // Save immediately
    await this.saveCollection(collection, newData);
    
    return data;
  }

  // Optimized update
  async update(collection: string, id: string, updates: any): Promise<any> {
    const currentData = await this.get(collection);
    
    const index = currentData.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Item with id ${id} not found in ${collection}`);
    }

    const updatedItem = { ...currentData[index], ...updates, updatedAt: new Date().toISOString() };
    currentData[index] = updatedItem;
    
    await this.saveCollection(collection, currentData);
    
    return updatedItem;
  }

  // Optimized delete
  async delete(collection: string, id: string): Promise<boolean> {
    const currentData = await this.get(collection);
    
    const index = currentData.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }

    currentData.splice(index, 1);
    await this.saveCollection(collection, currentData);
    
    return true;
  }

  // Helper methods
  async getItem(collection: string, id: string): Promise<any | null> {
    const data = await this.get(collection);
    return data.find(item => item.id === id) || null;
  }

  async find(collection: string, criteria: Record<string, any>): Promise<any[]> {
    const data = await this.get(collection);
    return data.filter(item => {
      return Object.entries(criteria).every(([key, value]) => item[key] === value);
    });
  }

  async findOne(collection: string, criteria: Record<string, any>): Promise<any | null> {
    const results = await this.find(collection, criteria);
    return results.length > 0 ? results[0] : null;
  }

  generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

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

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export default ImprovedGitHubSDK;
