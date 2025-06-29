
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
import CRMManager from './CRMManager';
import EmailMarketing from './EmailMarketing';
import InvoiceManager from './InvoiceManager';
import FormBuilder from './FormBuilder';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Calendar, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Mail,
  DollarSign,
  FormInput,
  UserCheck
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  author: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: string;
}

const ContentManager: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [postsData, contactsData] = await Promise.all([
        sdk.get('blog_posts'),
        sdk.get('contacts')
      ]);
      setBlogPosts(postsData || []);
      setContacts(contactsData || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load content data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlogPost = async () => {
    try {
      const newPost = await sdk.insert('blog_posts', {
        title: 'New Blog Post',
        content: 'Start writing your content here...',
        status: 'draft' as const,
        author: 'Admin',
        slug: `new-post-${Date.now()}`,
        createdAt: new Date().toISOString()
      });
      setBlogPosts([newPost, ...blogPosts]);
      toast({
        title: "Blog post created",
        description: "New blog post has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create blog post:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateContactStatus = async (id: string, status: Contact['status']) => {
    try {
      await sdk.update('contacts', id, { status });
      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
      toast({
        title: "Status updated",
        description: "Contact status has been updated.",
      });
    } catch (error) {
      console.error('Failed to update contact status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update contact status.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content & CMS Management</h2>
      </div>

      <Tabs defaultValue="blog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="blog" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Blog Posts</h3>
            <Button onClick={handleCreateBlogPost}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>

          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      By {post.author} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Submissions</h3>
          
          <div className="grid gap-4">
            {contacts.map((contact) => (
              <Card key={contact.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <Badge 
                      variant={
                        contact.status === 'new' ? 'destructive' : 
                        contact.status === 'responded' ? 'default' : 'secondary'
                      }
                    >
                      {contact.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{contact.email}</p>
                  <p className="text-gray-800 mb-4">{contact.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateContactStatus(contact.id, 'responded')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Responded
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <CRMManager />
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <EmailMarketing />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceManager />
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <FormBuilder />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Content Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Contact Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">New Contacts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contacts.filter(c => c.status === 'new').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Responded</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contacts.filter(c => c.status === 'responded').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">Advanced analytics dashboard with detailed insights coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
