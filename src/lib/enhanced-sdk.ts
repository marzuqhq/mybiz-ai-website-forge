
import ImprovedGitHubSDK from './improved-github-sdk';

// Enhanced SDK Configuration with improved schema
const sdkConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER || 'ridwanullahh',
  repo: import.meta.env.VITE_GITHUB_REPO || 'mybizaidb',
  token: import.meta.env.VITE_GITHUB_TOKEN || 'demo-token',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
  basePath: 'db'
};

// Initialize SDK with improved GitHub handling
const sdk = new ImprovedGitHubSDK(sdkConfig);

// Auto-create collections if they don't exist
const ensureCollections = async () => {
  const collections = [
    'users', 'websites', 'pages', 'blocks', 'blog_posts', 'products', 
    'faqs', 'customers', 'forms', 'form_submissions', 'invoices', 
    'chat_conversations', 'email_campaigns'
  ];

  for (const collection of collections) {
    try {
      await sdk.get(collection);
    } catch (error) {
      console.log(`Creating collection: ${collection}`);
      await sdk.saveCollection(collection, []);
    }
  }
};

// Initialize collections on startup
if (typeof window !== 'undefined') {
  ensureCollections().catch(error => {
    console.warn('Collection initialization warning:', error.message);
  });
}

export default sdk;
export { sdkConfig };
export type { 
  User, 
  Session, 
  CloudinaryUploadResult 
} from './UniversalSDK';
