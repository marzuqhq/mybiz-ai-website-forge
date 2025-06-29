
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
  Mail, 
  Send, 
  Users, 
  Calendar,
  BarChart3,
  Plus,
  Edit,
  Eye,
  Copy,
  Settings,
  Zap
} from 'lucide-react';

interface EmailCampaign {
  id: string;
  websiteId: string;
  name: string;
  subject: string;
  content: string;
  template: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  scheduledAt?: string;
  sentAt?: string;
  recipients: string[];
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  aiOptimized: boolean;
  segmentRules: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  createdAt: string;
}

const EmailMarketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await sdk.get('email_campaigns');
      setCampaigns(data || []);
    } catch (error) {
      console.error('Failed to load email campaigns:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load email campaigns.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCampaign = async () => {
    try {
      const newCampaign = await sdk.insert('email_campaigns', {
        websiteId: 'demo-website',
        name: 'New Campaign',
        subject: 'Your Subject Line',
        content: '<p>Start crafting your email content here...</p>',
        template: 'default',
        status: 'draft' as const,
        recipients: [],
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0,
        },
        aiOptimized: false,
        segmentRules: [],
        createdAt: new Date().toISOString(),
      });
      setCampaigns([newCampaign, ...campaigns]);
      toast({
        title: "Campaign created",
        description: "New email campaign has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create campaign:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create email campaign.",
        variant: "destructive",
      });
    }
  };

  const optimizeWithAI = async (campaignId: string) => {
    try {
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return;

      // Simulate AI optimization
      const optimizedSubject = `🚀 ${campaign.subject} - Limited Time!`;
      const optimizedContent = campaign.content.replace(
        /Start crafting your email content here.../,
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">AI-Optimized Content</h2>
          <p>This content has been optimized for better engagement and conversion rates.</p>
          <p>Key improvements:</p>
          <ul>
            <li>Compelling subject line with urgency</li>
            <li>Clear call-to-action placement</li>
            <li>Personalized content structure</li>
            <li>Mobile-optimized design</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Take Action Now
            </a>
          </div>
        </div>
        `
      );

      await sdk.update('email_campaigns', campaignId, {
        subject: optimizedSubject,
        content: optimizedContent,
        aiOptimized: true,
      });

      setCampaigns(campaigns.map(c => 
        c.id === campaignId 
          ? { ...c, subject: optimizedSubject, content: optimizedContent, aiOptimized: true }
          : c
      ));

      toast({
        title: "AI Optimization Complete",
        description: "Your campaign has been optimized for better performance.",
      });
    } catch (error) {
      console.error('Failed to optimize campaign:', error);
      toast({
        title: "Optimization failed",
        description: "Failed to optimize campaign with AI.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOpenRate = (campaign: EmailCampaign): number => {
    return campaign.stats.sent > 0 ? (campaign.stats.opened / campaign.stats.sent) * 100 : 0;
  };

  const calculateClickRate = (campaign: EmailCampaign): number => {
    return campaign.stats.opened > 0 ? (campaign.stats.clicked / campaign.stats.opened) * 100 : 0;
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
        <h2 className="text-2xl font-bold text-gray-900">Email Marketing</h2>
        <Button onClick={createCampaign}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        {campaign.aiOptimized && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Zap className="w-3 h-3 mr-1" />
                            AI Optimized
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{campaign.subject}</p>
                      
                      {campaign.status === 'sent' && (
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Sent:</span>
                            <span className="ml-1 font-medium">{campaign.stats.sent.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Open Rate:</span>
                            <span className="ml-1 font-medium">{calculateOpenRate(campaign).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Click Rate:</span>
                            <span className="ml-1 font-medium">{calculateClickRate(campaign).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Recipients:</span>
                            <span className="ml-1 font-medium">{campaign.recipients.length}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!campaign.aiOptimized && campaign.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => optimizeWithAI(campaign.id)}
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          AI Optimize
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button size="sm">
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Created: {new Date(campaign.createdAt).toLocaleDateString()}
                    {campaign.scheduledAt && (
                      <span className="ml-4">
                        Scheduled: {new Date(campaign.scheduledAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {campaigns.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first email campaign to start engaging with your audience.
                </p>
                <Button onClick={createCampaign}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Welcome Series', description: 'Perfect for onboarding new subscribers' },
              { name: 'Product Launch', description: 'Announce new products with style' },
              { name: 'Newsletter', description: 'Regular updates and news' },
              { name: 'Promotional', description: 'Drive sales with compelling offers' },
              { name: 'Event Invitation', description: 'Invite users to your events' },
              { name: 'Abandoned Cart', description: 'Recover lost sales automatically' },
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 mb-4">{template.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                    <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Send className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.reduce((sum, c) => sum + c.stats.sent, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.length > 0 
                        ? (campaigns.reduce((sum, c) => sum + calculateOpenRate(c), 0) / campaigns.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Click Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {campaigns.length > 0 
                        ? (campaigns.reduce((sum, c) => sum + calculateClickRate(c), 0) / campaigns.length).toFixed(1)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailMarketing;
