
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  Save,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface Product {
  id: string;
  websiteId: string;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  price: number;
  externalUrl: string;
}

interface ProductManagerProps {
  websiteId: string;
}

const ProductManager: React.FC<ProductManagerProps> = ({ websiteId }) => {
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    externalUrl: '',
  });

  useEffect(() => {
    loadProducts();
  }, [websiteId]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const allProducts = await sdk.get<Product>('products');
      const websiteProducts = allProducts.filter(p => p.websiteId === websiteId);
      setProducts(websiteProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast({
        title: "Validation error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newProduct = await sdk.insert<Product>('products', {
        websiteId,
        title: editForm.title,
        slug: editForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: editForm.description,
        price: parseFloat(editForm.price) || 0,
        imageUrl: editForm.imageUrl,
        externalUrl: editForm.externalUrl
      });

      setProducts([...products, newProduct]);
      setIsCreating(false);
      resetForm();
      
      toast({
        title: "Product created",
        description: "Your product has been created successfully.",
      });
    } catch (error: any) {
      console.error('Create product error:', error);
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create product.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !editForm.title.trim() || !editForm.description.trim()) return;

    try {
      const updatedProduct = await sdk.update<Product>('products', selectedProduct.id, {
        title: editForm.title,
        description: editForm.description,
        price: parseFloat(editForm.price) || 0,
        imageUrl: editForm.imageUrl,
        externalUrl: editForm.externalUrl,
        slug: editForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      });

      setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
      setIsEditing(false);
      setSelectedProduct(null);
      resetForm();
      
      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Update product error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update product.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await sdk.delete('products', productId);
      setProducts(products.filter(p => p.id !== productId));
      
      toast({
        title: "Product deleted",
        description: "The product has been deleted.",
      });
    } catch (error: any) {
      console.error('Delete product error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditForm({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      externalUrl: '',
    });
  };

  const startEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      externalUrl: product.externalUrl
    });
    setIsEditing(true);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products & Services</h2>
          <p className="text-gray-600">Showcase what you offer to your customers</p>
        </div>
        <Button onClick={startCreate} className="bg-gradient-to-r from-blue-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mt-1">{product.description}</p>
                </div>
                
                {product.price > 0 && (
                  <div className="flex items-center text-lg font-bold text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {product.price.toFixed(2)}
                  </div>
                )}

                {product.externalUrl && (
                  <a
                    href={product.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details
                  </a>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(product)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-4">
            Add products or services to showcase what you offer.
          </p>
          <Button onClick={startCreate} className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedProduct(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? 'Add a product or service to your website' : 'Update your product information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  placeholder="Product or service name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Describe your product or service..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={editForm.imageUrl}
                onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalUrl">External Link</Label>
              <Input
                id="externalUrl"
                value={editForm.externalUrl}
                onChange={(e) => setEditForm({...editForm, externalUrl: e.target.value})}
                placeholder="https://example.com/product"
              />
              <p className="text-xs text-gray-500">
                Link to external product page, booking system, or more information
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setSelectedProduct(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isCreating ? handleCreateProduct : handleUpdateProduct}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Add Product' : 'Update Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManager;
