
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
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
  CheckCircle
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
        status: 'draft',
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
        <h2 className="text-2xl font-bold text-gray-900">Content Management</h2>
      </div>

      <Tabs defaultValue="blog" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
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

        <TabsContent value="newsletter" className="space-y-4">
          <h3 className="text-lg font-semibold">Newsletter Management</h3>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">Newsletter management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">Content Analytics</h3>
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
