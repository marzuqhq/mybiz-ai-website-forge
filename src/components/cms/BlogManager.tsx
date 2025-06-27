
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
import { aiService } from '@/lib/ai';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Tag,
  Wand2,
  Save,
  X
} from 'lucide-react';

interface Post {
  id: string;
  websiteId: string;
  title: string;
  slug: string;
  markdownBody: string;
  tags: string[];
  publishedAt: string;
  summary: string;
}

interface BlogManagerProps {
  websiteId: string;
}

const BlogManager: React.FC<BlogManagerProps> = ({ websiteId }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    summary: '',
    markdownBody: '',
    tags: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [websiteId]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const allPosts = await sdk.get<Post>('posts');
      const websitePosts = allPosts.filter(p => p.websiteId === websiteId);
      setPosts(websitePosts.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      ));
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!editForm.title.trim() || !editForm.markdownBody.trim()) {
      toast({
        title: "Validation error",
        description: "Title and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newPost = await sdk.insert<Post>('posts', {
        websiteId,
        title: editForm.title,
        slug: editForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        markdownBody: editForm.markdownBody,
        summary: editForm.summary,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        publishedAt: new Date().toISOString()
      });

      setPosts([newPost, ...posts]);
      setIsCreating(false);
      resetForm();
      
      toast({
        title: "Post created",
        description: "Your blog post has been created successfully.",
      });
    } catch (error: any) {
      console.error('Create post error:', error);
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create post.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePost = async () => {
    if (!selectedPost || !editForm.title.trim() || !editForm.markdownBody.trim()) return;

    try {
      const updatedPost = await sdk.update<Post>('posts', selectedPost.id, {
        title: editForm.title,
        summary: editForm.summary,
        markdownBody: editForm.markdownBody,
        tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      });

      setPosts(posts.map(p => p.id === selectedPost.id ? updatedPost : p));
      setIsEditing(false);
      setSelectedPost(null);
      resetForm();
      
      toast({
        title: "Post updated",
        description: "Your blog post has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Update post error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update post.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await sdk.delete('posts', postId);
      setPosts(posts.filter(p => p.id !== postId));
      
      toast({
        title: "Post deleted",
        description: "The blog post has been deleted.",
      });
    } catch (error: any) {
      console.error('Delete post error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete post.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePost = async () => {
    try {
      setIsGenerating(true);
      
      const generatedPost = await aiService.generateBlogPost(
        editForm.title || 'Blog post for your business',
        editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        'professional'
      );

      setEditForm({
        title: generatedPost.title,
        summary: generatedPost.summary,
        markdownBody: generatedPost.content,
        tags: generatedPost.tags.join(', ')
      });

      toast({
        title: "Content generated",
        description: "AI has generated blog post content for you.",
      });
    } catch (error: any) {
      console.error('Generate post error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate content.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setEditForm({
      title: '',
      summary: '',
      markdownBody: '',
      tags: '',
    });
  };

  const startEdit = (post: Post) => {
    setSelectedPost(post);
    setEditForm({
      title: post.title,
      summary: post.summary,
      markdownBody: post.markdownBody,
      tags: post.tags.join(', ')
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
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <p className="text-gray-600">Manage your blog content and engage your audience</p>
        </div>
        <Button onClick={startCreate} className="bg-gradient-to-r from-blue-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(post)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePost(post.id)}
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

      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Edit className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No blog posts yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first blog post to start engaging with your audience.
          </p>
          <Button onClick={startCreate} className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Post
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedPost(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Create New Post' : 'Edit Post'}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? 'Write a new blog post for your website' : 'Update your blog post content'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  placeholder="Enter post title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                  placeholder="tag1, tag2, tag3..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={editForm.summary}
                onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                placeholder="Brief summary of your post..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Content *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePost}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3 mr-2" />
                      AI Generate
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="content"
                value={editForm.markdownBody}
                onChange={(e) => setEditForm({...editForm, markdownBody: e.target.value})}
                placeholder="Write your post content in Markdown..."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Supports Markdown formatting (headers, links, lists, etc.)
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setSelectedPost(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isCreating ? handleCreatePost : handleUpdatePost}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Create Post' : 'Update Post'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
