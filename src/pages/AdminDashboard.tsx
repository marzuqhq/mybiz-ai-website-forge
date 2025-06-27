
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import sdk from '@/lib/sdk';
import {
  Users,
  Globe,
  BarChart3,
  Settings,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
  Shield,
  Mail,
  FileText,
  Calendar
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalWebsites: number;
  activeWebsites: number;
  totalSubmissions: number;
  totalPosts: number;
  monthlyGrowth: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [websites, setWebsites] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is admin
    if (!user || !user.roles?.includes('admin')) {
      navigate('/');
      return;
    }
    loadAdminData();
  }, [user, navigate]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load all data
      const [usersData, websitesData, submissionsData, postsData] = await Promise.all([
        sdk.get('users'),
        sdk.get('websites'),
        sdk.get('submissions'),
        sdk.get('posts')
      ]);

      setUsers(usersData);
      setWebsites(websitesData);
      setSubmissions(submissionsData);

      // Calculate stats
      const activeWebsites = websitesData.filter(w => w.status === 'published').length;
      const monthlyGrowth = 15; // Mock data - in real app, calculate from dates

      setStats({
        totalUsers: usersData.length,
        totalWebsites: websitesData.length,
        activeWebsites,
        totalSubmissions: submissionsData.length,
        totalPosts: postsData.length,
        monthlyGrowth,
        systemHealth: 'healthy'
      });

    } catch (error: any) {
      console.error('Failed to load admin data:', error);
      toast({
        title: "Error loading data",
        description: error.message || "Failed to load admin dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'promote' | 'demote' | 'suspend') => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      let updates: any = {};
      
      switch (action) {
        case 'promote':
          updates.roles = [...(user.roles || []), 'admin'];
          break;
        case 'demote':
          updates.roles = (user.roles || []).filter((r: string) => r !== 'admin');
          break;
        case 'suspend':
          updates.status = user.status === 'suspended' ? 'active' : 'suspended';
          break;
      }

      await sdk.update('users', userId, updates);
      await loadAdminData(); // Reload data

      toast({
        title: "User updated",
        description: `User ${action} completed successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} user.`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load data</h2>
          <Button onClick={loadAdminData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Platform management and analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                System Healthy
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Websites</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWebsites}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeWebsites} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                Across all websites
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                Published content
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="websites">Websites</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">New user registered: john@example.com</span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm">Website published: Sweet Dreams Bakery</span>
                      <span className="text-xs text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm">New form submission received</span>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Response Time</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">125ms</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">99.9%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Sessions</span>
                      <Badge variant="secondary">1,234</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Storage Used</span>
                      <Badge variant="secondary">45.2 GB</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-gray-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-2 mt-1">
                          {user.roles?.map((role: string) => (
                            <Badge key={role} variant="secondary">{role}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!user.roles?.includes('admin') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'promote')}
                          >
                            Make Admin
                          </Button>
                        )}
                        {user.roles?.includes('admin') && user.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'demote')}
                          >
                            Remove Admin
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUserAction(user.id, 'suspend')}
                        >
                          {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="websites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Management</CardTitle>
                <CardDescription>Overview of all websites on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {websites.slice(0, 10).map((website) => (
                    <div key={website.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{website.name}</div>
                        <div className="text-sm text-gray-500">
                          {website.domain || `${website.name.toLowerCase().replace(/\s+/g, '-')}.mybiz.app`}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge 
                            variant={website.status === 'published' ? 'default' : 'secondary'}
                          >
                            {website.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Created {new Date(website.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>Platform growth over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Monthly Active Users</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">2,340</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Websites Created (This Month)</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">156</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Conversion Rate</span>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold">12.5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Features</CardTitle>
                  <CardDescription>Most used platform features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>AI Website Generator</span>
                      <span className="font-semibold">98.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prompt-based Editing</span>
                      <span className="font-semibold">87.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Blog/CMS</span>
                      <span className="font-semibold">45.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Custom Domain</span>
                      <span className="font-semibold">34.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Server Status</CardTitle>
                  <CardDescription>Real-time system monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Server className="w-4 h-4" />
                        <span>API Server</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span>Database</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Security</span>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">Secure</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>Recent system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
                    <div>[2024-01-15 10:30:15] INFO: System startup completed</div>
                    <div>[2024-01-15 10:31:22] INFO: AI service connected</div>
                    <div>[2024-01-15 10:32:18] INFO: Database migration completed</div>
                    <div>[2024-01-15 10:33:45] INFO: SSL certificates renewed</div>
                    <div>[2024-01-15 10:34:12] INFO: Backup completed successfully</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">AI Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">AI Provider</div>
                          <div className="text-sm text-gray-500">Primary AI service provider</div>
                        </div>
                        <Badge variant="secondary">Chutes AI + Gemini</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Rate Limiting</div>
                          <div className="text-sm text-gray-500">API requests per minute</div>
                        </div>
                        <Badge variant="secondary">100/min</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-500">Require 2FA for admin accounts</div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Session Timeout</div>
                          <div className="text-sm text-gray-500">Auto-logout after inactivity</div>
                        </div>
                        <Badge variant="secondary">24 hours</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
