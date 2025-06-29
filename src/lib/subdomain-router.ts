
interface SubdomainConfig {
  baseDomain: string;
  subdomainSuffix: string;
}

interface WebsiteRoute {
  subdomain: string;
  websiteId: string;
  userId: string;
}

class SubdomainRouter {
  private config: SubdomainConfig;
  private websiteRoutes: Map<string, WebsiteRoute> = new Map();

  constructor(config: SubdomainConfig) {
    this.config = config;
  }

  // Parse subdomain from current URL
  getCurrentSubdomain(): string | null {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    
    // Check if it's a subdomain (more than 2 parts for domain.com)
    if (parts.length > 2) {
      return parts[0];
    }
    
    return null;
  }

  // Check if current route is a user website
  isUserWebsite(): boolean {
    return this.getCurrentSubdomain() !== null;
  }

  // Get website info from subdomain
  async getWebsiteFromSubdomain(subdomain: string): Promise<WebsiteRoute | null> {
    if (this.websiteRoutes.has(subdomain)) {
      return this.websiteRoutes.get(subdomain)!;
    }

    // Fetch from database
    try {
      const websites = await import('./sdk').then(m => m.sdk.get('websites'));
      const website = websites.find((w: any) => w.subdomain === subdomain);
      
      if (website) {
        const route: WebsiteRoute = {
          subdomain,
          websiteId: website.id,
          userId: website.userId
        };
        this.websiteRoutes.set(subdomain, route);
        return route;
      }
    } catch (error) {
      console.error('Failed to fetch website from subdomain:', error);
    }

    return null;
  }

  // Generate subdomain URL
  generateSubdomainUrl(subdomain: string, path: string = ''): string {
    const protocol = window.location.protocol;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${protocol}//${subdomain}${this.config.subdomainSuffix}${cleanPath}`;
  }

  // Get base path for user website
  getBasePath(subdomain: string): string {
    return `/${subdomain}`;
  }

  // Check if subdomain is available
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    try {
      const websites = await import('./sdk').then(m => m.sdk.get('websites'));
      return !websites.some((w: any) => w.subdomain === subdomain);
    } catch (error) {
      console.error('Failed to check subdomain availability:', error);
      return false;
    }
  }

  // Register a new subdomain
  async registerSubdomain(subdomain: string, websiteId: string, userId: string): Promise<boolean> {
    const isAvailable = await this.isSubdomainAvailable(subdomain);
    if (!isAvailable) {
      throw new Error('Subdomain is already taken');
    }

    const route: WebsiteRoute = {
      subdomain,
      websiteId,
      userId
    };

    this.websiteRoutes.set(subdomain, route);
    return true;
  }
}

// Initialize with default config
const subdomainRouter = new SubdomainRouter({
  baseDomain: 'mybiz.top',
  subdomainSuffix: '.mybiz.top'
});

export default subdomainRouter;
export { SubdomainRouter };
export type { SubdomainConfig, WebsiteRoute };
