
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
  Users, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';

interface CRMContact {
  id: string;
  websiteId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: 'active' | 'inactive' | 'blocked';
  source: string;
  tags: string[];
  notes: Array<{
    id: string;
    content: string;
    createdAt: string;
    createdBy: string;
  }>;
  lastActivity: string;
  assignedTo: string;
  customFields: Record<string, any>;
  socialProfiles: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  dealValue: number;
  stage: 'lead' | 'prospect' | 'customer' | 'inactive';
  createdAt: string;
}

const CRMManager: React.FC = () => {
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const data = await sdk.get('crm_contacts');
      setContacts(data || []);
    } catch (error) {
      console.error('Failed to load CRM contacts:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load CRM contacts.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createContact = async () => {
    try {
      const newContact = await sdk.insert('crm_contacts', {
        websiteId: 'demo-website',
        firstName: 'New',
        lastName: 'Contact',
        email: 'contact@example.com',
        phone: '',
        company: '',
        position: '',
        status: 'active' as const,
        source: 'manual',
        tags: [],
        notes: [],
        lastActivity: new Date().toISOString(),
        assignedTo: 'current-user',
        customFields: {},
        socialProfiles: {},
        dealValue: 0,
        stage: 'lead' as const,
        createdAt: new Date().toISOString(),
      });
      setContacts([newContact, ...contacts]);
      toast({
        title: "Contact created",
        description: "New contact has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create contact:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create contact.",
        variant: "destructive",
      });
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchQuery === '' || 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = selectedStage === 'all' || contact.stage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalContacts = contacts.length;
  const totalDealValue = contacts.reduce((sum, contact) => sum + contact.dealValue, 0);
  const activeContacts = contacts.filter(c => c.status === 'active').length;
  const customerCount = contacts.filter(c => c.stage === 'customer').length;

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
        <h2 className="text-2xl font-bold text-gray-900">CRM Management</h2>
        <Button onClick={createContact}>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{activeContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deal Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalDealValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">{customerCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Stages</option>
          <option value="lead">Leads</option>
          <option value="prospect">Prospects</option>
          <option value="customer">Customers</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Contacts List */}
      <div className="grid gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.company && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {contact.company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStageColor(contact.stage)}>
                    {contact.stage}
                  </Badge>
                  {contact.dealValue > 0 && (
                    <Badge variant="outline">
                      ${contact.dealValue.toLocaleString()}
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {contact.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-500">
                Last activity: {new Date(contact.lastActivity).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedStage !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by adding your first contact.'}
            </p>
            {!searchQuery && selectedStage === 'all' && (
              <Button onClick={createContact}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Contact
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CRMManager;
