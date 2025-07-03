import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Globe, 
  Edit, 
  BarChart3, 
  Settings, 
  Eye,
  Trash2,
  ExternalLink,
  Calendar,
  FileText,
  Users
} from 'lucide-react';
import sdk from '@/lib/sdk';

interface Website {
  id: string;
  userId: string;
  name: string;
  domain?: string;
  status: 'draft' | 'published' | 'archived';
  businessInfo: any;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWebsites: 0,
    publishedWebsites: 0,
    totalViews: 0,
    totalSubmissions: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Load user's websites
      const allWebsites = await sdk.get('websites');
      const userWebsites = allWebsites.filter((w: Website) => w.userId === user.id);
      setWebsites(userWebsites);

      // Calculate stats
      const published = userWebsites.filter((w: Website) => w.status === 'published').length;
      
      // Load submissions for user's websites
      const allSubmissions = await sdk.get('submissions');
      const userSubmissions = allSubmissions.filter((s: any) => 
        userWebsites.some((w: Website) => w.id === s.websiteId)
      );

      setStats({
        totalWebsites: userWebsites.length,
        publishedWebsites: published,
        totalViews: userWebsites.length * 127, // Mock data
        totalSubmissions: userSubmissions.length
      });

    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Loading failed",
        description: error.message || "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWebsite = async (websiteId: string) => {
    if (!confirm('Are you sure you want to delete this website? This action cannot be undone.')) {
      return;
    }

    try {
      await sdk.delete('websites', websiteId);
      setWebsites(websites.filter(w => w.id !== websiteId));
      
      toast({
        title: "Website deleted",
        description: "The website has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete website.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.email?.split('@')[0]}!</h1>
              <p className="text-slate-600 mt-2">Manage your AI-powered websites and grow your business online.</p>
            </div>
            <Link to="/create">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Website
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Websites</CardTitle>
              <Globe className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalWebsites}</div>
              <p className="text-xs text-slate-500 mt-1">
                {stats.publishedWebsites} published
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Page Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">
                Across all websites
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Form Submissions</CardTitle>
              <Users className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stats.totalSubmissions}</div>
              <p className="text-xs text-slate-500 mt-1">
                New leads generated
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">AI Assistance</CardTitle>
              <FileText className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">Active</div>
              <p className="text-xs text-slate-500 mt-1">
                Ready to help
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Websites Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Your Websites</h2>
          </div>

          {websites.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="text-center py-12">
                <Globe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No websites yet</h3>
                <p className="text-slate-600 mb-6">
                  Create your first AI-powered website in under 60 seconds.
                </p>
                <Link to="/create">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Website
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((website) => (
                <Card key={website.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {website.name}
                      </CardTitle>
                      <Badge variant={website.status === 'published' ? 'default' : 'secondary'}>
                        {website.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {website.businessInfo?.businessType || 'Business Website'} • {website.businessInfo?.location || 'Online'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-slate-600">
                        <div>Created: {new Date(website.createdAt).toLocaleDateString()}</div>
                        <div>Updated: {new Date(website.updatedAt).toLocaleDateString()}</div>
                        {website.domain && (
                          <div className="flex items-center space-x-1 mt-2">
                            <ExternalLink className="w-3 h-3" />
                            <span className="font-mono text-xs">{website.domain}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link to={`/website/${website.id}`} className="flex-1">
                          <Button variant="outline" className="w-full hover:bg-indigo-50 hover:border-indigo-300">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        
                        {website.status === 'published' && (
                          <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Link to={`/website/${website.id}/cms`}>
                          <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </Link>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteWebsite(website.id)}
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Create New Website</span>
              </CardTitle>
              <CardDescription>
                Use AI to generate a complete website from your business description.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/create">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span>Analytics Dashboard</span>
              </CardTitle>
              <CardDescription>
                View detailed analytics and performance metrics for your websites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover:bg-green-50 hover:border-green-300">
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span>Manage Appointments</span>
              </CardTitle>
              <CardDescription>
                View and manage appointments booked through your websites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full hover:bg-orange-50 hover:border-orange-300">
                View Calendar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
