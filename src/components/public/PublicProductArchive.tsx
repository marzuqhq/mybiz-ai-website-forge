import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react';
import sdk from '@/lib/sdk';
import { Helmet } from 'react-helmet';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  inventory: number;
  images: string[];
  status: string;
  features: string[];
  specifications: any;
  slug: string;
}

interface Website {
  id: string;
  name: string;
  slug: string;
  businessInfo: any;
  theme: any;
}

const PublicProductArchive: React.FC = () => {
  const { websiteSlug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadProductData();
  }, [websiteSlug]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      
      // Get website
      const websites = await sdk.get('websites');
      const currentWebsite = websites.find((w: any) => w.slug === websiteSlug);
      if (!currentWebsite) {
        throw new Error('Website not found');
      }
      setWebsite(currentWebsite);

      // Get products
      const allProducts = await sdk.get('products');
      const websiteProducts = allProducts
        .filter((product: any) => product.websiteId === currentWebsite.id && product.status === 'active')
        .map((product: any) => ({
          ...product,
          slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }));
      
      setProducts(websiteProducts);
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categories = [...new Set(products.map(product => product.category))];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Website Not Found</h1>
          <p className="text-muted-foreground">The requested website could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Products - ${website.businessInfo?.name || website.name}`}</title>
        <meta name="description" content={`Browse our product catalog at ${website.businessInfo?.name || website.name}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to={`/${website.slug}`} className="text-xl font-bold text-foreground">
                {website.businessInfo?.name || website.name}
              </Link>
              <nav className="flex items-center space-x-6">
                <Link to={`/${website.slug}`} className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
                <Link to={`/${website.slug}/products`} className="text-foreground font-medium">
                  Products
                </Link>
                <Link to={`/${website.slug}/blog`} className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
                <Link to={`/${website.slug}/contact`} className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Products</h1>
            <p className="text-xl text-muted-foreground">
              Discover our carefully curated selection of quality products
            </p>
          </div>
        </section>

        {/* Filters and Search */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No products are currently available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      {product.inventory <= 5 && product.inventory > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                      <Link 
                        to={`/${website.slug}/products/${product.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {product.name}
                      </Link>
                    </CardTitle>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">4.5</span>
                      </div>
                    </div>
                    
                    {product.features.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex flex-wrap gap-1">
                          {product.features.slice(0, 2).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {product.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <Button 
                      asChild 
                      className="w-full mt-4"
                      disabled={product.inventory === 0}
                    >
                      <Link to={`/${website.slug}/products/${product.slug}`}>
                        {product.inventory === 0 ? 'Out of Stock' : 'View Details'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-secondary/20 mt-16 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-lg font-semibold mb-4">
              {website.businessInfo?.name || website.name}
            </h3>
            <p className="text-muted-foreground">
              {website.businessInfo?.description || 'Professional business website'}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PublicProductArchive;