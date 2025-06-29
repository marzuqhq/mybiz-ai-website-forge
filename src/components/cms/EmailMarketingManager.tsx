
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Mail, Send, Users, BarChart3, Sparkles } from 'lucide-react';
import sdk from '@/lib/sdk';
import AICMSController from '@/lib/ai-cms-controller';

interface EmailCampaign {
  id: string;
  websiteId: string;
  name: string;
  subject: string;
  content: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sent';
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

interface EmailMarketingManagerProps {
  websiteId: string;
  aiController?: AICMSController;
}

const EmailMarketingManager: React.FC<EmailMarketingManagerProps> = ({ websiteId, aiController }) => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    recipients: 'all' as 'all' | 'active' | 'prospects'
  });

  useEffect(() => {
    loadData();
  }, [websiteId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [campaignsData, customersData] = await Promise.all([
        sdk.get<EmailCampaign>('email_campaigns'),
        sdk.get('customers')
      ]);
      
      const websiteCampaigns = campaignsData.filter(campaign => campaign.websiteId === websiteId);
      const websiteCustomers = customersData.filter((customer: any) => customer.websiteId === websiteId);
      
      setCampaigns(websiteCampaigns);
      setCustomers(websiteCustomers);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateWithAI = async () => {
    if (!formData.name) {
      toast({
        title: "Campaign name required",
        description: "Please enter a campaign name first.",
        variant: "destructive",
      });
      return;
    }

    if (!aiController) {
      toast({
        title: "AI not available",
        description: "AI controller is not configured.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const aiResult = await aiController.generateEmailCampaign('promotional', formData.name);
      setFormData(prev => ({
        ...prev,
        subject: aiResult.subject,
        content: aiResult.content
      }));
      
      toast({
        title: "Content generated",
        description: "AI has generated email campaign content for you.",
      });
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getRecipients = () => {
    switch (formData.recipients) {
      case 'active':
        return customers.filter(c => c.status === 'active').map(c => c.email);
      case 'prospects':
        return customers.filter(c => c.status === 'prospect').map(c => c.email);
      default:
        return customers.map(c => c.email);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.subject.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter campaign name and subject.",
        variant: "destructive",
      });
      return;
    }

    try {
      const recipients = getRecipients();
      const campaignData = {
        websiteId,
        name: formData.name,
        subject: formData.subject,
        content: formData.content,
        recipients,
        status: 'draft' as const,
        stats: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0
        }
      };

      if (editingCampaign) {
        await sdk.update('email_campaigns', editingCampaign.id, campaignData);
        toast({
          title: "Campaign updated",
          description: "Email campaign has been updated successfully.",
        });
      } else {
        await sdk.insert('email_campaigns', campaignData);
        toast({
          title: "Campaign created",
          description: "Email campaign has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingCampaign(null);
      setFormData({ name: '', subject: '', content: '', recipients: 'all' });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error saving campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      recipients: 'all'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await sdk.delete('email_campaigns', campaignId);
      toast({
        title: "Campaign deleted",
        description: "Email campaign has been deleted successfully.",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error deleting campaign",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', subject: '', content: '', recipients: 'all' });
    setEditingCampaign(null);
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
          <h2 className="text-2xl font-bold text-gray-900">Email Marketing</h2>
          <p className="text-gray-600">Create and manage email campaigns</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Email Campaign' : 'Create Email Campaign'}
              </DialogTitle>
              <DialogDescription>
                {editingCampaign ? 'Update your email campaign' : 'Create a new email marketing campaign'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter campaign name..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipients</label>
                  <Select value={formData.recipients} onValueChange={(value: any) => setFormData(prev => ({ ...prev, recipients: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers ({customers.length})</SelectItem>
                      <SelectItem value="active">Active Customers ({customers.filter(c => c.status === 'active').length})</SelectItem>
                      <SelectItem value="prospects">Prospects ({customers.filter(c => c.status === 'prospect').length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Line *</label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject..."
                  />
                  <Button 
                    onClick={generateWithAI}
                    disabled={isGenerating || !formData.name}
                    variant="outline"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your email content..."
                  rows={12}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No email campaigns yet</h3>
            <p className="text-gray-600 mb-6">
              Start engaging with your customers through email marketing.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-purple-500 to-pink-600">
              <Plus className="w-4 h-4 mr-2" />
              Create First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {campaign.subject}
                    </CardDescription>
                  </div>
                  <Badge variant={
                    campaign.status === 'sent' ? 'default' : 
                    campaign.status === 'scheduled' ? 'secondary' : 'outline'
                  }>
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      Recipients
                    </span>
                    <span className="font-medium">{campaign.recipients.length}</span>
                  </div>
                  
                  {campaign.status === 'sent' && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Delivered</span>
                        <span className="font-medium">{campaign.stats.delivered}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Opened</span>
                        <span className="font-medium">{campaign.stats.opened}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Clicked</span>
                        <span className="font-medium">{campaign.stats.clicked}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(campaign)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  {campaign.status === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailMarketingManager;
