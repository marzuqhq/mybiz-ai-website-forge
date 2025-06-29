
import sdk from './sdk';

export interface PageTemplate {
  id: string;
  name: string;
  type: 'blog' | 'product' | 'landing' | 'about' | 'contact' | 'custom';
  template: string;
  styles: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface GeneratedPage {
  id: string;
  websiteId: string;
  slug: string;
  title: string;
  content: string;
  type: string;
  metadata: any;
  published: boolean;
  createdAt: string;
}

class AIPageGenerator {
  private websiteId: string;
  private businessContext: any;

  constructor(websiteId: string, businessContext: any = {}) {
    this.websiteId = websiteId;
    this.businessContext = businessContext;
  }

  // Generate blog archive page
  async generateBlogArchive(): Promise<string> {
    const posts = await sdk.get('posts');
    const websitePosts = posts.filter((post: any) => post.websiteId === this.websiteId);

    const archiveHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - ${this.businessContext.name || 'My Business'}</title>
    <meta name="description" content="Latest blog posts and articles from ${this.businessContext.name || 'our business'}">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <h1 class="text-3xl font-bold text-gray-900">Blog</h1>
            <p class="text-gray-600 mt-2">Latest insights and updates</p>
        </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${websitePosts.map((post: any) => `
                <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div class="p-6">
                        <h2 class="text-xl font-semibold mb-3">
                            <a href="/blog/${post.slug}" class="text-gray-900 hover:text-blue-600">
                                ${post.title}
                            </a>
                        </h2>
                        <p class="text-gray-600 mb-4">${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                        <div class="flex items-center justify-between text-sm text-gray-500">
                            <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                            <a href="/blog/${post.slug}" class="text-blue-600 hover:text-blue-800">Read more →</a>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>
    </main>
    
    <footer class="bg-white border-t mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; 2024 ${this.businessContext.name || 'My Business'}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    return archiveHTML;
  }

  // Generate single blog post page
  async generateBlogPost(postId: string): Promise<string> {
    const posts = await sdk.get('posts');
    const post = posts.find((p: any) => p.id === postId);
    
    if (!post) {
      throw new Error('Post not found');
    }

    const postHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - ${this.businessContext.name || 'My Business'}</title>
    <meta name="description" content="${post.excerpt || post.content.substring(0, 160)}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm">
        <div class="max-w-4xl mx-auto px-4 py-6">
            <nav class="mb-4">
                <a href="/blog" class="text-blue-600 hover:text-blue-800">← Back to Blog</a>
            </nav>
            <h1 class="text-4xl font-bold text-gray-900 mb-4">${post.title}</h1>
            <div class="flex items-center text-gray-600">
                <span>By ${post.author || 'Admin'}</span>
                <span class="mx-2">•</span>
                <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                ${post.readTime ? `<span class="mx-2">•</span><span>${post.readTime} min read</span>` : ''}
            </div>
        </div>
    </header>
    
    <main class="max-w-4xl mx-auto px-4 py-8">
        <article class="bg-white rounded-lg shadow-sm p-8">
            <div id="content" class="prose prose-lg max-w-none">
                ${post.markdownBody ? '' : post.content}
            </div>
        </article>
        
        ${post.tags && post.tags.length > 0 ? `
        <div class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Tags</h3>
            <div class="flex flex-wrap gap-2">
                ${post.tags.map((tag: string) => `
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${tag}</span>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </main>
    
    <footer class="bg-white border-t mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; 2024 ${this.businessContext.name || 'My Business'}. All rights reserved.</p>
        </div>
    </footer>
    
    <script>
        // Render markdown if present
        ${post.markdownBody ? `
        document.getElementById('content').innerHTML = marked.parse(\`${post.markdownBody}\`);
        ` : ''}
    </script>
</body>
</html>`;

    return postHTML;
  }

  // Generate product archive page
  async generateProductArchive(): Promise<string> {
    const products = await sdk.get('products');
    const websiteProducts = products.filter((product: any) => product.websiteId === this.websiteId);

    const archiveHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - ${this.businessContext.name || 'My Business'}</title>
    <meta name="description" content="Browse our complete product catalog">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <h1 class="text-3xl font-bold text-gray-900">Our Products</h1>
            <p class="text-gray-600 mt-2">Discover our amazing products and services</p>
        </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${websiteProducts.map((product: any) => `
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    ${product.image ? `
                        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    ` : `
                        <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span class="text-gray-400">No Image</span>
                        </div>
                    `}
                    <div class="p-4">
                        <h3 class="font-semibold text-lg mb-2">
                            <a href="/products/${product.slug}" class="text-gray-900 hover:text-blue-600">
                                ${product.name}
                            </a>
                        </h3>
                        <p class="text-gray-600 text-sm mb-3">${product.shortDescription || product.description?.substring(0, 100) + '...' || ''}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-2xl font-bold text-green-600">$${product.price}</span>
                            <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </main>
    
    <footer class="bg-white border-t mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; 2024 ${this.businessContext.name || 'My Business'}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    return archiveHTML;
  }

  // Generate single product page
  async generateProductPage(productId: string): Promise<string> {
    const products = await sdk.get('products');
    const product = products.find((p: any) => p.id === productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    const productHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - ${this.businessContext.name || 'My Business'}</title>
    <meta name="description" content="${product.shortDescription || product.description?.substring(0, 160) || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-6">
            <nav class="mb-4">
                <a href="/products" class="text-blue-600 hover:text-blue-800">← Back to Products</a>
            </nav>
        </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div class="p-8">
                    ${product.image ? `
                        <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
                    ` : `
                        <div class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span class="text-gray-400 text-xl">No Image Available</span>
                        </div>
                    `}
                </div>
                
                <div class="p-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">${product.name}</h1>
                    <p class="text-3xl font-bold text-green-600 mb-6">$${product.price}</p>
                    
                    ${product.shortDescription ? `
                        <p class="text-lg text-gray-600 mb-6">${product.shortDescription}</p>
                    ` : ''}
                    
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold mb-3">Description</h3>
                        <div class="prose prose-sm max-w-none text-gray-600">
                            ${product.description || 'No description available.'}
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <button class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                            Add to Cart - $${product.price}
                        </button>
                        <button class="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                            Add to Wishlist
                        </button>
                    </div>
                    
                    ${product.tags && product.tags.length > 0 ? `
                    <div class="mt-8">
                        <h3 class="text-lg font-semibold mb-3">Tags</h3>
                        <div class="flex flex-wrap gap-2">
                            ${product.tags.map((tag: string) => `
                                <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </main>
    
    <footer class="bg-white border-t mt-16">
        <div class="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>&copy; 2024 ${this.businessContext.name || 'My Business'}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    return productHTML;
  }

  // Generate dynamic landing page based on business data
  async generateLandingPage(): Promise<string> {
    const [posts, products, faqs] = await Promise.all([
      sdk.get('posts').then(data => data.filter((item: any) => item.websiteId === this.websiteId)),
      sdk.get('products').then(data => data.filter((item: any) => item.websiteId === this.websiteId)),
      sdk.get('faqs').then(data => data.filter((item: any) => item.websiteId === this.websiteId))
    ]);

    const landingHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.businessContext.name || 'Welcome to My Business'}</title>
    <meta name="description" content="${this.businessContext.description || 'Professional business website powered by AI'}">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div class="max-w-7xl mx-auto px-4 py-20">
            <div class="text-center">
                <h1 class="text-5xl font-bold mb-6">${this.businessContext.name || 'Welcome to Our Business'}</h1>
                <p class="text-xl mb-8 max-w-3xl mx-auto">
                    ${this.businessContext.description || 'Discover amazing products and services crafted with care and powered by AI innovation.'}
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/products" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Explore Products
                    </a>
                    <a href="/contact" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                        Get In Touch
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    ${products.length > 0 ? `
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                <p class="text-gray-600">Discover our most popular items</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${products.slice(0, 3).map((product: any) => `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        ${product.image ? `
                            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                        ` : `
                            <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
                                <span class="text-gray-400">Product Image</span>
                            </div>
                        `}
                        <div class="p-6">
                            <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                            <p class="text-gray-600 mb-4">${product.shortDescription || ''}</p>
                            <div class="flex items-center justify-between">
                                <span class="text-2xl font-bold text-green-600">$${product.price}</span>
                                <a href="/products/${product.slug}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    View Details
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="text-center mt-12">
                <a href="/products" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    View All Products
                </a>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Latest Blog Posts -->
    ${posts.length > 0 ? `
    <section class="py-16">
        <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Latest Insights</h2>
                <p class="text-gray-600">Stay updated with our latest blog posts</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${posts.slice(0, 3).map((post: any) => `
                    <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div class="p-6">
                            <h3 class="font-semibold text-lg mb-3">
                                <a href="/blog/${post.slug}" class="text-gray-900 hover:text-blue-600">
                                    ${post.title}
                                </a>
                            </h3>
                            <p class="text-gray-600 mb-4">${post.excerpt || post.content.substring(0, 120) + '...'}</p>
                            <div class="flex items-center justify-between text-sm text-gray-500">
                                <span>${new Date(post.createdAt).toLocaleDateString()}</span>
                                <a href="/blog/${post.slug}" class="text-blue-600 hover:text-blue-800">Read more →</a>
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
            <div class="text-center mt-12">
                <a href="/blog" class="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                    Read All Posts
                </a>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- FAQ Section -->
    ${faqs.length > 0 ? `
    <section class="py-16 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <p class="text-gray-600">Find answers to common questions</p>
            </div>
            <div class="space-y-6">
                ${faqs.slice(0, 5).map((faq: any) => `
                    <div class="bg-white rounded-lg p-6 shadow-sm">
                        <h3 class="font-semibold text-lg mb-2">${faq.question}</h3>
                        <p class="text-gray-600">${faq.answer}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- CTA Section -->
    <section class="py-16 bg-blue-600 text-white">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p class="text-xl mb-8">Join thousands of satisfied customers who trust our products and services.</p>
            <a href="/contact" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Us Today
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="font-semibold text-lg mb-4">${this.businessContext.name || 'My Business'}</h3>
                    <p class="text-gray-400">
                        ${this.businessContext.description || 'Professional business solutions powered by AI technology.'}
                    </p>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2">
                        <li><a href="/products" class="text-gray-400 hover:text-white">Products</a></li>
                        <li><a href="/blog" class="text-gray-400 hover:text-white">Blog</a></li>
                        <li><a href="/about" class="text-gray-400 hover:text-white">About</a></li>
                        <li><a href="/contact" class="text-gray-400 hover:text-white">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Support</h4>
                    <ul class="space-y-2">
                        <li><a href="/help" class="text-gray-400 hover:text-white">Help Center</a></li>
                        <li><a href="/faq" class="text-gray-400 hover:text-white">FAQ</a></li>
                        <li><a href="/privacy" class="text-gray-400 hover:text-white">Privacy Policy</a></li>
                        <li><a href="/terms" class="text-gray-400 hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-semibold mb-4">Connect</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white">Twitter</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Facebook</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">LinkedIn</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Instagram</a></li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 ${this.businessContext.name || 'My Business'}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;

    return landingHTML;
  }

  // Save generated page to database
  async savePage(pageData: Omit<GeneratedPage, 'id' | 'createdAt'>): Promise<GeneratedPage> {
    const page = await sdk.insert<GeneratedPage>('pages', {
      ...pageData,
      createdAt: new Date().toISOString()
    });
    return page;
  }

  // Get all generated pages for website
  async getPages(): Promise<GeneratedPage[]> {
    const allPages = await sdk.get<GeneratedPage>('pages');
    return allPages.filter(page => page.websiteId === this.websiteId);
  }
}

export default AIPageGenerator;
