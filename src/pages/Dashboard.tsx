
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Globe, 
  Edit, 
  Settings, 
  BarChart3, 
  Users, 
  Mail,
  LogOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import sdk from '@/lib/sdk';

interface Website {
  id: string;
  userId: string;
  name: string;
  domain?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  businessInfo: any;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWebsites();
    }
  }, [user]);

  const loadWebsites = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const allWebsites = await sdk.get('websites') as Website[];
      const userWebsites = allWebsites.filter(website => website.userId === user.id);
      setWebsites(userWebsites);
    } catch (error: any) {
      console.error('Failed to load websites:', error);
      toast({
        title: "Loading failed",
        description: error.message || "Failed to load your websites.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your websites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                MyBiz AI Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your AI-Powered Websites
          </h2>
          <p className="text-gray-600">
            Create, manage, and optimize your professional websites with AI assistance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/create-website')}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Create Website</h3>
              <p className="text-sm text-gray-600">Build with AI assistance</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
              <p className="text-sm text-gray-600">Track performance</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Customers</h3>
              <p className="text-sm text-gray-600">Manage relationships</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Email Marketing</h3>
              <p className="text-sm text-gray-600">Reach your audience</p>
            </CardContent>
          </Card>
        </div>

        {/* Websites Grid */}
        {websites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No websites yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first AI-powered website.
              </p>
              <Button onClick={() => navigate('/create-website')} className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Website
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <Card key={website.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{website.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {website.businessInfo?.businessType || 'Business Website'}
                      </CardDescription>
                    </div>
                    <Badge variant={website.status === 'published' ? 'default' : 'secondary'}>
                      {website.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <p>Domain: {website.domain || `${website.slug}.mybiz.app`}</p>
                      <p>Created: {new Date(website.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/website/${website.id}`)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/cms/${website.id}`)}
                        className="flex-1"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        CMS
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/${website.slug}`, '_blank')}
                        className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                      >
                        <Globe className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create New Website Button */}
        {websites.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              onClick={() => navigate('/create-website')} 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Another Website
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
