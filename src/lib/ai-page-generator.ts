
import sdk from './sdk';

interface PageGenerationConfig {
  websiteId: string;
  pageType: 'blog-archive' | 'blog-post' | 'product-catalog' | 'product-page' | 'landing-page' | 'about' | 'contact';
  businessData?: any;
  seoConfig?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  customData?: any;
}

interface GeneratedPage {
  html: string;
  css: string;
  javascript: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    slug: string;
    pageType: string;
  };
}

class AIPageGenerator {
  private static instance: AIPageGenerator;
  
  static getInstance(): AIPageGenerator {
    if (!AIPageGenerator.instance) {
      AIPageGenerator.instance = new AIPageGenerator();
    }
    return AIPageGenerator.instance;
  }

  async generatePage(config: PageGenerationConfig): Promise<GeneratedPage> {
    console.log('🎨 Generating page:', config.pageType);
    
    try {
      const website = await sdk.getItem('websites', config.websiteId);
      if (!website) {
        throw new Error('Website not found');
      }

      const businessInfo = website.businessInfo || {};
      const theme = website.theme || {};
      
      let pageData: any = {};
      
      // Fetch relevant data based on page type
      switch (config.pageType) {
        case 'blog-archive':
          pageData.posts = await sdk.queryBuilder('blog_posts')
            .where((post: any) => post.websiteId === config.websiteId && post.status === 'published')
            .sort('publishedAt', 'desc')
            .exec();
          break;
          
        case 'blog-post':
          if (config.customData?.postId) {
            pageData.post = await sdk.getItem('blog_posts', config.customData.postId);
            pageData.relatedPosts = await sdk.queryBuilder('blog_posts')
              .where((post: any) => post.websiteId === config.websiteId && post.status === 'published' && post.id !== config.customData.postId)
              .sort('publishedAt', 'desc')
              .exec();
            pageData.relatedPosts = pageData.relatedPosts.slice(0, 3);
          }
          break;
          
        case 'product-catalog':
          pageData.products = await sdk.queryBuilder('products')
            .where((product: any) => product.websiteId === config.websiteId && product.status === 'active')
            .sort('createdAt', 'desc')
            .exec();
          break;
          
        case 'product-page':
          if (config.customData?.productId) {
            pageData.product = await sdk.getItem('products', config.customData.productId);
            pageData.relatedProducts = await sdk.queryBuilder('products')
              .where((product: any) => product.websiteId === config.websiteId && product.status === 'active' && product.id !== config.customData.productId)
              .exec();
            pageData.relatedProducts = pageData.relatedProducts.slice(0, 4);
          }
          break;
      }

      // Generate the page content
      const generatedPage = await this.createPageContent(config, pageData, businessInfo, theme);
      
      console.log('✅ Page generated successfully');
      return generatedPage;
      
    } catch (error) {
      console.error('❌ Page generation failed:', error);
      throw error;
    }
  }

  private async createPageContent(
    config: PageGenerationConfig, 
    pageData: any, 
    businessInfo: any, 
    theme: any
  ): Promise<GeneratedPage> {
    
    const baseStyles = this.generateBaseCSS(theme);
    const baseScript = this.generateBaseJavaScript();
    
    switch (config.pageType) {
      case 'blog-archive':
        return this.generateBlogArchive(config, pageData, businessInfo, baseStyles, baseScript);
      case 'blog-post':
        return this.generateBlogPost(config, pageData, businessInfo, baseStyles, baseScript);
      case 'product-catalog':
        return this.generateProductCatalog(config, pageData, businessInfo, baseStyles, baseScript);
      case 'product-page':
        return this.generateProductPage(config, pageData, businessInfo, baseStyles, baseScript);
      case 'landing-page':
        return this.generateLandingPage(config, pageData, businessInfo, baseStyles, baseScript);
      case 'about':
        return this.generateAboutPage(config, pageData, businessInfo, baseStyles, baseScript);
      case 'contact':
        return this.generateContactPage(config, pageData, businessInfo, baseStyles, baseScript);
      default:
        throw new Error(`Unsupported page type: ${config.pageType}`);
    }
  }

  private generateBlogArchive(config: PageGenerationConfig, pageData: any, businessInfo: any, baseStyles: string, baseScript: string): GeneratedPage {
    const posts = pageData.posts || [];
    const businessName = businessInfo.name || 'Business Blog';
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - Blog</title>
    <meta name="description" content="Latest blog posts and insights from ${businessName}">
    <meta name="keywords" content="blog, articles, insights, ${businessName}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1 class="site-title">${businessName}</h1>
            <nav class="main-nav">
                <a href="/" class="nav-link">Home</a>
                <a href="/blog" class="nav-link active">Blog</a>
                <a href="/about" class="nav-link">About</a>
                <a href="/contact" class="nav-link">Contact</a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <div class="page-header">
                <h1 class="page-title">Latest Articles</h1>
                <p class="page-subtitle">Insights, tips, and stories from our team</p>
            </div>

            <div class="blog-grid" id="blogGrid">
                ${posts.map((post: any) => `
                    <article class="blog-card" data-aos="fade-up">
                        <div class="blog-card-image">
                            <img src="${post.featuredImage || '/api/placeholder/400/240'}" alt="${post.title}" loading="lazy">
                            <div class="blog-card-category">${post.category || 'General'}</div>
                        </div>
                        <div class="blog-card-content">
                            <h2 class="blog-card-title">
                                <a href="/blog/${post.slug || post.id}">${post.title}</a>
                            </h2>
                            <p class="blog-card-excerpt">${post.excerpt || post.content.substring(0, 150) + '...'}</p>
                            <div class="blog-card-meta">
                                <span class="blog-date">${new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                                <span class="blog-author">By ${post.author || 'Admin'}</span>
                            </div>
                            <a href="/blog/${post.slug || post.id}" class="read-more-btn">Read More</a>
                        </div>
                    </article>
                `).join('')}
            </div>

            ${posts.length === 0 ? `
                <div class="empty-state">
                    <h3>No posts yet</h3>
                    <p>Check back soon for new content!</p>
                </div>
            ` : ''}

            <div class="pagination" id="pagination">
                <!-- Pagination will be handled by JavaScript -->
            </div>
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; 2024 ${businessName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    const css = baseStyles + `
        .blog-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }

        .blog-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .blog-card-image {
            position: relative;
            height: 240px;
            overflow: hidden;
        }

        .blog-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .blog-card:hover .blog-card-image img {
            transform: scale(1.05);
        }

        .blog-card-category {
            position: absolute;
            top: 1rem;
            left: 1rem;
            background: var(--primary-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .blog-card-content {
            padding: 1.5rem;
        }

        .blog-card-title a {
            color: var(--text-dark);
            text-decoration: none;
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.4;
        }

        .blog-card-title a:hover {
            color: var(--primary-color);
        }

        .blog-card-excerpt {
            color: var(--text-muted);
            margin: 1rem 0;
            line-height: 1.6;
        }

        .blog-card-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 1rem 0;
            font-size: 0.875rem;
            color: var(--text-muted);
        }

        .read-more-btn {
            display: inline-flex;
            align-items: center;
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .read-more-btn:hover {
            color: var(--primary-dark);
        }

        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-muted);
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin: 3rem 0;
        }

        .pagination button {
            padding: 0.75rem 1rem;
            border: 1px solid #e2e8f0;
            background: white;
            color: var(--text-dark);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .pagination button:hover {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .pagination button.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
    `;

    const javascript = baseScript + `
        // Blog-specific functionality
        class BlogArchive {
            constructor() {
                this.postsPerPage = 6;
                this.currentPage = 1;
                this.allPosts = Array.from(document.querySelectorAll('.blog-card'));
                this.init();
            }

            init() {
                this.setupPagination();
                this.setupSearch(); 
                this.setupFiltering();
                this.setupAOS();
            }

            setupPagination() {
                const totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
                if (totalPages <= 1) return;

                const paginationContainer = document.getElementById('pagination');
                let paginationHTML = '';

                // Previous button
                paginationHTML += \`<button onclick="blogArchive.goToPage(\${this.currentPage - 1})" \${this.currentPage === 1 ? 'disabled' : ''}>Previous</button>\`;

                // Page numbers
                for (let i = 1; i <= totalPages; i++) {
                    paginationHTML += \`<button onclick="blogArchive.goToPage(\${i})" class="\${i === this.currentPage ? 'active' : ''}">\${i}</button>\`;
                }

                // Next button
                paginationHTML += \`<button onclick="blogArchive.goToPage(\${this.currentPage + 1})" \${this.currentPage === totalPages ? 'disabled' : ''}>Next</button>\`;

                paginationContainer.innerHTML = paginationHTML;
                this.showCurrentPage();
            }

            goToPage(page) {
                const totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
                if (page < 1 || page > totalPages) return;

                this.currentPage = page;
                this.setupPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            showCurrentPage() {
                const startIndex = (this.currentPage - 1) * this.postsPerPage;
                const endIndex = startIndex + this.postsPerPage;

                this.allPosts.forEach((post, index) => {
                    if (index >= startIndex && index < endIndex) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });
            }

            setupSearch() {
                // Add search functionality if needed
                const searchInput = document.getElementById('blogSearch');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        this.filterPosts(e.target.value);
                    });
                }
            }

            setupFiltering() {
                // Add category filtering if needed
                const categoryFilters = document.querySelectorAll('.category-filter');
                categoryFilters.forEach(filter => {
                    filter.addEventListener('click', (e) => {
                        const category = e.target.dataset.category;
                        this.filterByCategory(category);
                    });
                });
            }

            setupAOS() {
                // Simple fade-in animation
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    });
                });

                document.querySelectorAll('[data-aos]').forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(el);
                });
            }

            filterPosts(searchTerm) {
                const filteredPosts = this.allPosts.filter(post => {
                    const title = post.querySelector('.blog-card-title').textContent.toLowerCase();
                    const excerpt = post.querySelector('.blog-card-excerpt').textContent.toLowerCase();
                    return title.includes(searchTerm.toLowerCase()) || excerpt.includes(searchTerm.toLowerCase());
                });

                this.showFilteredPosts(filteredPosts);
            }

            showFilteredPosts(posts) {
                this.allPosts.forEach(post => post.style.display = 'none');
                posts.forEach(post => post.style.display = 'block');
            }
        }

        // Initialize blog archive
        const blogArchive = new BlogArchive();
    `;

    return {
      html,
      css,
      javascript,
      metadata: {
        title: `${businessName} - Blog`,
        description: `Latest blog posts and insights from ${businessName}`,
        keywords: ['blog', 'articles', 'insights', businessName],
        slug: 'blog',
        pageType: 'blog-archive'
      }
    };
  }

  private generateBlogPost(config: PageGenerationConfig, pageData: any, businessInfo: any, baseStyles: string, baseScript: string): GeneratedPage {
    const post = pageData.post;
    const relatedPosts = pageData.relatedPosts || [];
    const businessName = businessInfo.name || 'Business Blog';

    if (!post) {
      throw new Error('Post data is required for blog post generation');
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.seoTitle || post.title} - ${businessName}</title>
    <meta name="description" content="${post.seoDescription || post.excerpt || post.content.substring(0, 160)}">
    <meta name="keywords" content="${post.tags ? post.tags.join(', ') : ''}">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt || post.content.substring(0, 160)}">
    <meta property="og:image" content="${post.featuredImage || ''}">
    <meta property="og:type" content="article">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1 class="site-title">${businessName}</h1>
            <nav class="main-nav">
                <a href="/" class="nav-link">Home</a>
                <a href="/blog" class="nav-link">Blog</a>
                <a href="/about" class="nav-link">About</a>
                <a href="/contact" class="nav-link">Contact</a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <article class="blog-post">
                <header class="post-header">
                    ${post.featuredImage ? `
                        <div class="post-featured-image">
                            <img src="${post.featuredImage}" alt="${post.title}" loading="lazy">
                        </div>
                    ` : ''}
                    <div class="post-meta">
                        <span class="post-category">${post.category || 'General'}</span>
                        <time class="post-date">${new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        <span class="post-author">By ${post.author || 'Admin'}</span>
                    </div>
                    <h1 class="post-title">${post.title}</h1>
                    ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
                </header>

                <div class="post-content">
                    ${this.formatPostContent(post.content)}
                </div>

                <footer class="post-footer">
                    ${post.tags && post.tags.length > 0 ? `
                        <div class="post-tags">
                            <strong>Tags:</strong>
                            ${post.tags.map((tag: string) => `<span class="post-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="post-share">
                        <strong>Share this post:</strong>
                        <div class="share-buttons">
                            <button onclick="sharePost('twitter')" class="share-btn twitter">Twitter</button>
                            <button onclick="sharePost('facebook')" class="share-btn facebook">Facebook</button>
                            <button onclick="sharePost('linkedin')" class="share-btn linkedin">LinkedIn</button>
                            <button onclick="copyLink()" class="share-btn copy">Copy Link</button>
                        </div>
                    </div>
                </footer>
            </article>

            ${relatedPosts.length > 0 ? `
                <section class="related-posts">
                    <h2>Related Posts</h2>
                    <div class="related-posts-grid">
                        ${relatedPosts.map((relatedPost: any) => `
                            <article class="related-post-card">
                                <div class="related-post-image">
                                    <img src="${relatedPost.featuredImage || '/api/placeholder/300/180'}" alt="${relatedPost.title}">
                                </div>
                                <div class="related-post-content">
                                    <h3><a href="/blog/${relatedPost.slug || relatedPost.id}">${relatedPost.title}</a></h3>
                                    <p>${relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}</p>
                                    <time>${new Date(relatedPost.publishedAt || relatedPost.createdAt).toLocaleDateString()}</time>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </section>
            ` : ''}
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; 2024 ${businessName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    const css = baseStyles + `
        .blog-post {
            max-width: 800px;
            margin: 0 auto;
        }

        .post-header {
            margin-bottom: 3rem;
        }

        .post-featured-image {
            margin-bottom: 2rem;
            border-radius: 12px;
            overflow: hidden;
        }

        .post-featured-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
        }

        .post-meta {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            color: var(--text-muted);
        }

        .post-category {
            background: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-weight: 500;
        }

        .post-title {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .post-excerpt {
            font-size: 1.25rem;
            color: var(--text-muted);
            line-height: 1.6;
        }

        .post-content {
            font-size: 1.125rem;
            line-height: 1.8;
            color: var(--text-dark);
        }

        .post-content h2 {
            font-size: 1.875rem;
            font-weight: 600;
            margin: 2rem 0 1rem 0;
            color: var(--text-dark);
        }

        .post-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.5rem 0 1rem 0;
            color: var(--text-dark);
        }

        .post-content p {
            margin-bottom: 1.5rem;
        }

        .post-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1.5rem 0;
        }

        .post-content blockquote {
            border-left: 4px solid var(--primary-color);
            padding-left: 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: var(--text-muted);
        }

        .post-footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
        }

        .post-tags {
            margin-bottom: 2rem;
        }

        .post-tag {
            display: inline-block;
            background: #f1f5f9;
            color: var(--text-dark);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            margin: 0 0.5rem 0.5rem 0;
            font-size: 0.875rem;
        }

        .post-share .share-buttons {
            display: flex;
            gap: 0.75rem;
            margin-top: 0.5rem;
        }

        .share-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.3s ease;
        }

        .share-btn.twitter { background: #1DA1F2; color: white; }
        .share-btn.facebook { background: #4267B2; color: white; }
        .share-btn.linkedin { background: #2867B2; color: white; }
        .share-btn.copy { background: #6366F1; color: white; }

        .related-posts {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
        }

        .related-posts h2 {
            margin-bottom: 2rem;
            color: var(--text-dark);
        }

        .related-posts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .related-post-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }

        .related-post-card:hover {
            transform: translateY(-4px);
        }

        .related-post-image {
            height: 180px;
            overflow: hidden;
        }

        .related-post-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .related-post-content {
            padding: 1.5rem;
        }

        .related-post-content h3 a {
            color: var(--text-dark);
            text-decoration: none;
            font-weight: 600;
        }

        .related-post-content h3 a:hover {
            color: var(--primary-color);
        }

        @media (max-width: 768px) {
            .post-title {
                font-size: 2rem;
            }
            
            .post-meta {
                flex-wrap: wrap;
            }
            
            .share-buttons {
                flex-wrap: wrap;
            }
        }
    `;

    const javascript = baseScript + `
        // Blog post specific functionality
        function sharePost(platform) {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent(document.querySelector('.post-excerpt')?.textContent || '');
            
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = \`https://twitter.com/intent/tweet?url=\${url}&text=\${title}\`;
                    break;
                case 'facebook':
                    shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${url}\`;
                    break;
                case 'linkedin':
                    shareUrl = \`https://www.linkedin.com/sharing/share-offsite/?url=\${url}\`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=550,height=420');
            }
        }

        function copyLink() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const btn = event.target;
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            });
        }

        // Reading progress indicator
        function initProgressIndicator() {
            const progressBar = document.createElement('div');
            progressBar.className = 'reading-progress';
            progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
            document.body.appendChild(progressBar);

            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                
                document.querySelector('.reading-progress-bar').style.width = scrollPercent + '%';
            });
        }

        // Initialize features
        document.addEventListener('DOMContentLoaded', () => {
            initProgressIndicator();
        });
    `;

    return {
      html,
      css: css + `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(99, 102, 241, 0.1);
            z-index: 1000;
        }

        .reading-progress-bar {
            height: 100%;
            background: var(--primary-color);
            width: 0%;
            transition: width 0.3s ease;
        }
      `,
      javascript,
      metadata: {
        title: `${post.seoTitle || post.title} - ${businessName}`,
        description: post.seoDescription || post.excerpt || post.content.substring(0, 160),
        keywords: post.tags || [],
        slug: post.slug || post.id,
        pageType: 'blog-post'
      }
    };
  }

  private generateProductCatalog(config: PageGenerationConfig, pageData: any, businessInfo: any, baseStyles: string, baseScript: string): GeneratedPage {
    const products = pageData.products || [];
    const businessName = businessInfo.name || 'Business Store';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - ${businessName}</title>
    <meta name="description" content="Browse our complete product catalog at ${businessName}">
    <meta name="keywords" content="products, catalog, shop, ${businessName}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1 class="site-title">${businessName}</h1>
            <nav class="main-nav">
                <a href="/" class="nav-link">Home</a>
                <a href="/products" class="nav-link active">Products</a>
                <a href="/about" class="nav-link">About</a>
                <a href="/contact" class="nav-link">Contact</a>
            </nav>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <div class="page-header">
                <h1 class="page-title">Our Products</h1>
                <p class="page-subtitle">Discover our range of quality products</p>
            </div>

            <div class="catalog-filters">
                <div class="filter-group">
                    <label for="categoryFilter">Category:</label>
                    <select id="categoryFilter">
                        <option value="">All Categories</option>
                        ${[...new Set(products.map((p: any) => p.category).filter(Boolean))].map(category => 
                            `<option value="${category}">${category}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="filter-group">
                    <label for="sortBy">Sort by:</label>
                    <select id="sortBy">
                        <option value="name">Name A-Z</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="newest">Newest First</option>
                    </select>
                </div>
                <div class="filter-group">
                    <input type="text" id="searchProducts" placeholder="Search products...">
                </div>
            </div>

            <div class="products-grid" id="productsGrid">
                ${products.map((product: any) => `
                    <div class="product-card" data-category="${product.category || ''}" data-price="${product.price}" data-name="${product.name}" data-date="${product.createdAt}">
                        <div class="product-image">
                            <img src="${product.images?.[0] || '/api/placeholder/300/300'}" alt="${product.name}" loading="lazy">
                            ${product.inventory === 0 ? '<div class="out-of-stock-badge">Out of Stock</div>' : ''}
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">
                                <a href="/products/${product.id}">${product.name}</a>
                            </h3>
                            <p class="product-description">${product.description ? product.description.substring(0, 100) + '...' : ''}</p>
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <div class="product-actions">
                                <button class="add-to-cart-btn" data-product-id="${product.id}" ${product.inventory === 0 ? 'disabled' : ''}>
                                    ${product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}  
                                </button>
                                <a href="/products/${product.id}" class="view-details-btn">View Details</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${products.length === 0 ? `
                <div class="empty-state">
                    <h3>No products available</h3>
                    <p>Check back soon for new products!</p>
                </div>
            ` : ''}
        </div>
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>&copy; 2024 ${businessName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    const css = baseStyles + `
        .catalog-filters {
            display: flex;
            gap: 1rem;
            margin: 2rem 0;
            padding: 1.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            flex-wrap: wrap;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .filter-group label {
            font-weight: 500;
            color: var(--text-dark);
        }

        .filter-group select,
        .filter-group input {
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 0.875rem;
        }

        .products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .product-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .product-image {
            position: relative;
            height: 250px;
            overflow: hidden;
        }

        .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .product-card:hover .product-image img {
            transform: scale(1.05);
        }

        .out-of-stock-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #ef4444;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .product-info {
            padding: 1.5rem;
        }

        .product-name a {
            color: var(--text-dark);
            text-decoration: none;
            font-size: 1.125rem;
            font-weight: 600;
            line-height: 1.4;
        }

        .product-name a:hover {
            color: var(--primary-color);
        }

        .product-description {
            color: var(--text-muted);
            margin: 0.75rem 0;
            line-height: 1.5;
        }

        .product-price {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            margin: 1rem 0;
        }

        .product-actions {
            display: flex;
            gap: 0.75rem;
            flex-wrap: wrap;
        }

        .add-to-cart-btn,
        .view-details-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 120px;
        }

        .add-to-cart-btn {
            background: var(--primary-color);
            color: white;
        }

        .add-to-cart-btn:hover:not(:disabled) {
            background: var(--primary-dark);
        }

        .add-to-cart-btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }

        .view-details-btn {
            background: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
        }

        .view-details-btn:hover {
            background: var(--primary-color);
            color: white;
        }

        .empty-state {
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-muted);
        }

        @media (max-width: 768px) {
            .catalog-filters {
                flex-direction: column;
            }
            
            .product-actions {
                flex-direction: column;
            }
        }
    `;

    const javascript = baseScript + `
        // Product catalog functionality
        class ProductCatalog {
            constructor() {
                this.products = Array.from(document.querySelectorAll('.product-card'));
                this.init();
            }

            init() {
                this.setupFilters();
                this.setupSearch();
                this.setupAddToCart();
                this.loadCart();
            }

            setupFilters() {
                const categoryFilter = document.getElementById('categoryFilter');
                const sortBy = document.getElementById('sortBy');

                categoryFilter?.addEventListener('change', () => this.filterProducts());
                sortBy?.addEventListener('change', () => this.sortProducts());
            }

            setupSearch() {
                const searchInput = document.getElementById('searchProducts');
                searchInput?.addEventListener('input', (e) => {
                    this.searchProducts(e.target.value);
                });
            }

            filterProducts() {
                const selectedCategory = document.getElementById('categoryFilter').value;
                
                this.products.forEach(product => {
                    const productCategory = product.dataset.category;
                    if (!selectedCategory || productCategory === selectedCategory) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }

            sortProducts() {
                const sortBy = document.getElementById('sortBy').value;
                const productsGrid = document.getElementById('productsGrid');
                const sortedProducts = [...this.products];

                sortedProducts.sort((a, b) => {
                    switch(sortBy) {
                        case 'name':
                            return a.dataset.name.localeCompare(b.dataset.name);
                        case 'price-low':
                            return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                        case 'price-high':
                            return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                        case 'newest':
                            return new Date(b.dataset.date) - new Date(a.dataset.date);
                        default:
                            return 0;
                    }
                });

                // Re-append products in sorted order
                sortedProducts.forEach(product => productsGrid.appendChild(product));
            }

            searchProducts(searchTerm) {
                const term = searchTerm.toLowerCase();
                
                this.products.forEach(product => {
                    const name = product.dataset.name.toLowerCase();
                    const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
                    
                    if (name.includes(term) || description.includes(term)) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }

            setupAddToCart() {
                document.addEventListener('click', (e) => {
                    if (e.target.classList.contains('add-to-cart-btn')) {
                        const productId = e.target.dataset.productId;
                        this.addToCart(productId);
                    }
                });
            }

            addToCart(productId) {
                let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    const productCard = document.querySelector(\`[data-product-id="\${productId}"]\`).closest('.product-card');
                    const name = productCard.dataset.name;
                    const price = parseFloat(productCard.dataset.price);
                    const image = productCard.querySelector('img').src;
                    
                    cart.push({
                        id: productId,
                        name: name,
                        price: price,
                        image: image,
                        quantity: 1
                    });
                }
                
                sessionStorage.setItem('cart', JSON.stringify(cart));
                this.updateCartDisplay();
                this.showCartNotification();
            }

            loadCart() {
                this.updateCartDisplay();
            }

            updateCartDisplay() {
                const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                
                // Update cart count in header if exists
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    cartCount.textContent = totalItems;
                    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
                }
            }

            showCartNotification() {
                const notification = document.createElement('div');
                notification.className = 'cart-notification';
                notification.textContent = 'Product added to cart!';
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);

                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, 2000);
            }
        }

        // Initialize product catalog
        const productCatalog = new ProductCatalog();
    `;

    return {
      html,
      css: css + `
        .cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }

        .cart-notification.show {
            transform: translateX(0);
        }
      `,
      javascript,
      metadata: {
        title: `Products - ${businessName}`,
        description: `Browse our complete product catalog at ${businessName}`,
        keywords: ['products', 'catalog', 'shop', businessName],
        slug: 'products',
        pageType: 'product-catalog'
      }
    };
  }

  private generateLandingPage(config: PageGenerationConfig, pageData: any, businessInfo: any, baseStyles: string, baseScript: string): GeneratedPage {
    const businessName = businessInfo.name || 'Your Business';
    const businessDescription = businessInfo.description || 'We provide exceptional products and services';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessName} - ${businessDescription}</title>
    <meta name="description" content="${businessDescription}">
    <meta name="keywords" content="${businessInfo.keywords || 'business, services, products'}">
    <meta property="og:title" content="${businessName}">
    <meta property="og:description" content="${businessDescription}">
    <meta property="og:type" content="website">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <h1 class="site-title">${businessName}</h1>
            <nav class="main-nav">
                <a href="#hero" class="nav-link">Home</a>
                <a href="#features" class="nav-link">Features</a>
                <a href="#about" class="nav-link">About</a>
                <a href="#contact" class="nav-link">Contact</a>
            </nav>
            <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>
        </div>
    </header>

    <main>
        <section id="hero" class="hero-section">
            <div class="hero-background"></div>
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">${businessName}</h1>
                    <p class="hero-subtitle">${businessDescription}</p>
                    <div class="hero-actions">
                        <button class="cta-button primary" onclick="scrollToSection('contact')">Get Started</button>
                        <button class="cta-button secondary" onclick="scrollToSection('features')">Learn More</button>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="features-section">
            <div class="container">
                <div class="section-header">
                    <h2>Why Choose Us</h2>
                    <p>We deliver exceptional value through our core strengths</p>
                </div>
                <div class="features-grid">
                    <div class="feature-card" data-aos="fade-up">
                        <div class="feature-icon">🚀</div>
                        <h3>Fast & Reliable</h3>
                        <p>Quick turnaround times without compromising on quality</p>
                    </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                        <div class="feature-icon">💡</div>
                        <h3>Innovative Solutions</h3>
                        <p>Creative approaches to solve your unique challenges</p>
                    </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                        <div class="feature-icon">🛡️</div>
                        <h3>Trusted & Secure</h3>
                        <p>Your data and privacy are our top priorities</p>
                    </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="300">
                        <div class="feature-icon">🌟</div>
                        <h3>Premium Quality</h3>
                        <p>Excellence in every detail of our work</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" class="about-section">
            <div class="container">
                <div class="about-content">
                    <div class="about-text">
                        <h2>About ${businessName}</h2>
                        <p>We are passionate about delivering exceptional results for our clients. With years of experience and a commitment to innovation, we help businesses achieve their goals through our specialized services.</p>
                        <p>Our team combines expertise with creativity to provide solutions that drive real results. We believe in building long-term partnerships with our clients based on trust, transparency, and mutual success.</p>
                        <div class="stats-grid">
                            <div class="stat-item">
                                <div class="stat-number" data-count="500">0</div>
                                <div class="stat-label">Happy Clients</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" data-count="1000">0</div>
                                <div class="stat-label">Projects Completed</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" data-count="5">0</div>
                                <div class="stat-label">Years Experience</div>
                            </div>
                        </div>
                    </div>
                    <div class="about-image">
                        <img src="/api/placeholder/500/400" alt="About ${businessName}" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="contact-section">
            <div class="container">
                <div class="section-header">
                    <h2>Get In Touch</h2>
                    <p>Ready to start your project? Let's discuss how we can help you achieve your goals.</p>
                </div>
                <div class="contact-content">
                    <div class="contact-form">
                        <form id="contactForm" onsubmit="handleContactForm(event)">
                            <div class="form-group">
                                <label for="name">Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="subject">Subject</label>
                                <input type="text" id="subject" name="subject" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit" class="submit-btn">Send Message</button>
                        </form>
                    </div>
                    <div class="contact-info">
                        <div class="contact-item">
                            <h4>Email</h4>
                            <p>${businessInfo.email || 'hello@business.com'}</p>
                        </div>
                        <div class="contact-item">
                            <h4>Phone</h4>
                            <p>${businessInfo.phone || '+1 (555) 123-4567'}</p>
                        </div>
                        <div class="contact-item">
                            <h4>Address</h4>
                            <p>${businessInfo.address || '123 Business St, City, State 12345'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${businessName}</h3>
                    <p>${businessDescription}</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#hero">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact Info</h4>
                    <p>${businessInfo.email || 'hello@business.com'}</p>
                    <p>${businessInfo.phone || '+1 (555) 123-4567'}</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${businessName}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;

    const css = baseStyles + `
        .hero-section {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            overflow: hidden;
        }

        .hero-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('/api/placeholder/1920/1080') center/cover;
            opacity: 0.1;
        }

        .hero-content {
            position: relative;
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }

        .hero-subtitle {
            font-size: 1.5rem;
            margin-bottom: 2.5rem;
            opacity: 0.9;
            line-height: 1.6;
        }

        .hero-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .cta-button {
            padding: 1rem 2rem;
            border: 2px solid white;
            border-radius: 8px;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .cta-button.primary {
            background: white;
            color: var(--primary-color);
        }

        .cta-button.primary:hover {
            background: transparent;
            color: white;
        }

        .cta-button.secondary {
            background: transparent;
            color: white;
        }

        .cta-button.secondary:hover {
            background: white;
            color: var(--primary-color);
        }

        .features-section {
            padding: 6rem 0;
            background: #f8fafc;
        }

        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }

        .section-header h2 {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .section-header p {
            font-size: 1.25rem;
            color: var(--text-muted);
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
        }

        .feature-card {
            background: white;
            padding: 2.5rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
        }

        .feature-card h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 1rem;
        }

        .feature-card p {
            color: var(--text-muted);
            line-height: 1.6;
        }

        .about-section {
            padding: 6rem 0;
        }

        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }

        .about-text h2 {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 1.5rem;
        }

        .about-text p {
            font-size: 1.125rem;
            color: var(--text-muted);
            line-height: 1.8;
            margin-bottom: 1.5rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            margin-top: 3rem;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: var(--text-muted);
            font-weight: 500;
        }

        .about-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 12px;
        }

        .contact-section {
            padding: 6rem 0;
            background: #f8fafc;
        }

        .contact-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 4rem;
        }

        .contact-form {
            background: white;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-dark);
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-color);
        }

        .submit-btn {
            width: 100%;
            padding: 1rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.125rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
            background: var(--primary-dark);
        }

        .contact-info {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .contact-item h4 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-dark);
            margin-bottom: 0.5rem;
        }

        .contact-item p {
            color: var(--text-muted);
            font-size: 1.125rem;
        }

        .site-footer {
            background: var(--text-dark);
            color: white;
            padding: 3rem 0 1rem 0;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .footer-section h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .footer-section h4 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
        }

        .footer-section ul {
            list-style: none;
            padding: 0;
        }

        .footer-section ul li {
            margin-bottom: 0.5rem;
        }

        .footer-section ul li a {
            color: #cbd5e1;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
            color: white;
        }

        .footer-bottom {
            padding-top: 2rem;
            border-top: 1px solid #374151;
            text-align: center;
            color: #9ca3af;
        }

        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-subtitle {
                font-size: 1.25rem;
            }
            
            .hero-actions {
                flex-direction: column;
                align-items: center;
            }
            
            .cta-button {
                width: 100%;
                max-width: 300px;
            }
            
            .about-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .contact-content {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .mobile-menu-toggle {
                display: block;
            }
            
            .main-nav {
                display: none;
            }
        }
    `;

    const javascript = baseScript + `
        // Landing page specific functionality
        class LandingPage {
            constructor() {
                this.init();
            }

            init() {
                this.setupSmoothScrolling();
                this.setupAnimatedCounters();
                this.setupScrollEffects();
                this.setupContactForm();
                this.setupMobileMenu();
            }

            setupSmoothScrolling() {
                // Smooth scrolling for navigation links
                document.addEventListener('click', (e) => {
                    if (e.target.matches('a[href^="#"]')) {
                        e.preventDefault();
                        const targetId = e.target.getAttribute('href').substring(1);
                        this.scrollToSection(targetId);
                    }
                });
            }

            setupAnimatedCounters() {
                const counters = document.querySelectorAll('.stat-number');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                });

                counters.forEach(counter => observer.observe(counter));
            }

            animateCounter(element) {
                const target = parseInt(element.dataset.count);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = Math.floor(current);
                }, 40);
            }

            setupScrollEffects() {
                // Simple AOS-like animations
                const animatedElements = document.querySelectorAll('[data-aos]');
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const delay = entry.target.dataset.aosDelay || 0;
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, delay);
                        }
                    });
                });

                animatedElements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    observer.observe(el);
                });
            }

            setupContactForm() {
                const form = document.getElementById('contactForm');
                if (form) {
                    form.addEventListener('submit', this.handleContactForm.bind(this));
                }
            }

            handleContactForm(event) {
                event.preventDefault();
                const formData = new FormData(event.target);
                const data = Object.fromEntries(formData);

                // Simulate form submission
                this.showNotification('Thank you for your message! We\\'ll get back to you soon.', 'success');
                event.target.reset();
            }

            setupMobileMenu() {
                // Mobile menu functionality would go here
                window.toggleMobileMenu = () => {
                    const nav = document.querySelector('.main-nav');
                    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
                };
            }

            scrollToSection(sectionId) {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            showNotification(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = \`notification notification-\${type}\`;
                notification.textContent = message;
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);

                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }
        }

        // Global functions for inline event handlers
        window.scrollToSection = (sectionId) => {
            landingPage.scrollToSection(sectionId);
        };

        window.handleContactForm = (event) => {
            landingPage.handleContactForm(event);
        };

        // Initialize landing page
        const landingPage = new LandingPage();
    `;

    return {
      html,
      css: css + `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification-success {
            background: #10b981;
        }

        .notification-error {
            background: #ef4444;
        }

        .notification-info {
            background: var(--primary-color);
        }
      `,
      javascript,
      metadata: {
        title: `${businessName} - ${businessDescription}`,
        description: businessDescription,
        keywords: businessInfo.keywords?.split(',') || ['business', 'services', 'products'],
        slug: 'home',
        pageType: 'landing-page'
      }
    };
  }

  // Add more page type generators as needed...
  private generateAboutPage(config: PageGenerationConfig, pageData: any, businessInfo: any, baseStyles: string, baseScript: string): GeneratedPage {
    // Implementation for about page
    return this.generateLandingPage(config, pageData, businessInfo, baseStyles, baseScript);
  }

  private generateContactPage(config: PageGenerationConfig, pageData: any, businessInfo: any, baseStyles: string, baseScript: string): GeneratedPage {
    // Implementation for contact page
    return this.generateLandingPage(config, pageData, businessInfo, baseStyles, baseScript);
  }

  private generateProductPage(config: PageGenerationConfig, pageData: any, businessInfo: any, baseStyles: string, baseScript: string): GeneratedPage {
    // Implementation for individual product page
    return this.generateProductCatalog(config, pageData, businessInfo, baseStyles, baseScript);
  }

  private formatPostContent(content: string): string {
    // Simple markdown-like formatting
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  private generateBaseCSS(theme: any): string {
    return `
      :root {
        --primary-color: ${theme.primaryColor || '#6366F1'};
        --primary-dark: ${this.darkenColor(theme.primaryColor || '#6366F1', 20)};
        --secondary-color: ${theme.secondaryColor || '#8B5CF6'};
        --accent-color: ${theme.accentColor || '#FF6B6B'};
        --text-dark: #1f2937;
        --text-muted: #6b7280;
        --background: #ffffff;
        --background-alt: #f8fafc;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: '${theme.fontFamily || 'Inter'}', -apple-system, BlinkMacSystemFont, sans-serif;
        line-height: 1.6;
        color: var(--text-dark);
        background: var(--background);
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }

      .site-header {
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
      }

      .site-header .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
      }

      .site-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
      }

      .main-nav {
        display: flex;
        gap: 2rem;
      }

      .nav-link {
        color: var(--text-dark);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
      }

      .nav-link:hover,
      .nav-link.active {
        color: var(--primary-color);
      }

      .main-content {
        margin-top: 80px;
        padding: 3rem 0;
      }

      .page-header {
        text-align: center;
        margin-bottom: 3rem;
      }

      .page-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 1rem;
      }

      .page-subtitle {
        font-size: 1.25rem;
        color: var(--text-muted);
      }

      @media (max-width: 768px) {
        .container {
          padding: 0 1rem;
        }
        
        .page-title {
          font-size: 2rem;
        }
        
        .main-nav {
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 1rem;
          display: none;
        }
      }
    `;
  }

  private generateBaseJavaScript(): string {
    return `
      // Base JavaScript utilities
      class Utils {
        static formatDate(date) {
          return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }

        static formatPrice(price) {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(price);
        }

        static debounce(func, wait) {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        }

        static throttle(func, limit) {
          let inThrottle;
          return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(() => inThrottle = false, limit);
            }
          }
        }
      }

      // Initialize common functionality
      document.addEventListener('DOMContentLoaded', () => {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });

        // Lazy loading for images
        const images = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
          const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
              }
            });
          });

          images.forEach(img => imageObserver.observe(img));
        }
      });
    `;
  }

  private darkenColor(hex: string, percent: number): string {
    // Simple color darkening utility
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}

export default AIPageGenerator;
export { AIPageGenerator };
export type { PageGenerationConfig, GeneratedPage };
