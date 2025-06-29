
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
import { 
  FormInput, 
  Plus, 
  Trash2, 
  Copy, 
  Settings,
  Zap,
  BarChart3,
  Code,
  Eye,
  Edit,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  List,
  Image,
  FileText
} from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FormBuilderData {
  id: string;
  websiteId: string;
  name: string;
  description: string;
  fields: FormField[];
  settings: {
    requireAuth: boolean;
    allowMultiple: boolean;
    saveProgress: boolean;
    enableSpamProtection: boolean;
    redirectUrl?: string;
    successMessage: string;
  };
  styling: {
    theme: 'default' | 'modern' | 'minimal' | 'colorful';
    customCss: string;
    buttonColor: string;
    textColor: string;
  };
  notifications: {
    email: boolean;
    webhook: string;
    autoResponse: boolean;
    autoResponseMessage: string;
  };
  integrations: Array<{
    type: 'email' | 'crm' | 'webhook' | 'analytics';
    config: Record<string, any>;
  }>;
  submissions: number;
  conversionRate: number;
  status: 'active' | 'inactive' | 'archived';
  aiOptimized: boolean;
  createdAt: string;
}

const FormBuilder: React.FC = () => {
  const [forms, setForms] = useState<FormBuilderData[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormBuilderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'analytics'>('builder');
  const { toast } = useToast();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setIsLoading(true);
      const data = await sdk.get('form_builder');
      setForms(data || []);
    } catch (error) {
      console.error('Failed to load forms:', error);
      toast({
        title: "Loading failed",
        description: "Failed to load forms.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createForm = async () => {
    try {
      const newForm = await sdk.insert('form_builder', {
        websiteId: 'demo-website',
        name: 'New Form',
        description: 'Description of your form',
        fields: [
          {
            id: '1',
            type: 'text' as const,
            label: 'Name',
            placeholder: 'Enter your name',
            required: true,
          },
          {
            id: '2',
            type: 'email' as const,
            label: 'Email',
            placeholder: 'Enter your email',
            required: true,
          },
        ],
        settings: {
          requireAuth: false,
          allowMultiple: true,
          saveProgress: false,
          enableSpamProtection: true,
          successMessage: 'Thank you for your submission!',
        },
        styling: {
          theme: 'default' as const,
          customCss: '',
          buttonColor: '#6366F1',
          textColor: '#374151',
        },
        notifications: {
          email: true,
          webhook: '',
          autoResponse: false,
          autoResponseMessage: 'Thank you for contacting us. We will get back to you soon.',
        },
        integrations: [],
        submissions: 0,
        conversionRate: 0,
        status: 'active' as const,
        aiOptimized: false,
        createdAt: new Date().toISOString(),
      });
      setForms([newForm, ...forms]);
      setSelectedForm(newForm);
      toast({
        title: "Form created",
        description: "New form has been created successfully.",
      });
    } catch (error) {
      console.error('Failed to create form:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create form.",
        variant: "destructive",
      });
    }
  };

  const optimizeWithAI = async (formId: string) => {
    try {
      const form = forms.find(f => f.id === formId);
      if (!form) return;

      // Simulate AI optimization
      const optimizedFields = [
        ...form.fields,
        {
          id: Date.now().toString(),
          type: 'phone' as const,
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: false,
        },
      ];

      const optimizedSettings = {
        ...form.settings,
        successMessage: '🎉 Thank you! Your submission has been received and we\'ll respond within 24 hours.',
      };

      await sdk.update('form_builder', formId, {
        fields: optimizedFields,
        settings: optimizedSettings,
        aiOptimized: true,
      });

      setForms(forms.map(f => 
        f.id === formId 
          ? { ...f, fields: optimizedFields, settings: optimizedSettings, aiOptimized: true }
          : f
      ));

      if (selectedForm?.id === formId) {
        setSelectedForm({ ...selectedForm, fields: optimizedFields, settings: optimizedSettings, aiOptimized: true });
      }

      toast({
        title: "AI Optimization Complete",
        description: "Your form has been optimized for better conversion rates.",
      });
    } catch (error) {
      console.error('Failed to optimize form:', error);
      toast({
        title: "Optimization failed",
        description: "Failed to optimize form with AI.",
        variant: "destructive",
      });
    }
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'textarea': return <FileText className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'checkbox': return <CheckSquare className="w-4 h-4" />;
      case 'select': return <List className="w-4 h-4" />;
      case 'file': return <Image className="w-4 h-4" />;
      default: return <FormInput className="w-4 h-4" />;
    }
  };

  const totalSubmissions = forms.reduce((sum, form) => sum + form.submissions, 0);
  const averageConversionRate = forms.length > 0 
    ? forms.reduce((sum, form) => sum + form.conversionRate, 0) / forms.length 
    : 0;

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
        <h2 className="text-2xl font-bold text-gray-900">Form Builder</h2>
        <Button onClick={createForm}>
          <Plus className="w-4 h-4 mr-2" />
          New Form
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FormInput className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Conversion</p>
                <p className="text-2xl font-bold text-gray-900">{averageConversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Forms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forms.filter(f => f.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forms List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Forms</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedForm?.id === form.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedForm(form)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{form.name}</h3>
                        <p className="text-sm text-gray-600">{form.fields.length} fields</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                          {form.status}
                        </Badge>
                        {form.aiOptimized && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700">
                            <Zap className="w-3 h-3" />
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Editor */}
        <div className="lg:col-span-2">
          {selectedForm ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedForm.name}</CardTitle>
                  <div className="flex space-x-2">
                    {!selectedForm.aiOptimized && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => optimizeWithAI(selectedForm.id)}
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
                      <Code className="w-4 h-4 mr-1" />
                      Embed
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-6 border-b">
                  {['builder', 'settings', 'analytics'].map((tab) => (
                    <button
                      key={tab}
                      className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab as any)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {activeTab === 'builder' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Form Name
                      </label>
                      <Input value={selectedForm.name} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Textarea value={selectedForm.description} readOnly />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Form Fields</h3>
                      <div className="space-y-3">
                        {selectedForm.fields.map((field, index) => (
                          <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {getFieldIcon(field.type)}
                                <div>
                                  <p className="font-medium text-gray-900">{field.label}</p>
                                  <p className="text-sm text-gray-600 capitalize">
                                    {field.type} {field.required && '• Required'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Form Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Require Authentication</span>
                          <Badge variant={selectedForm.settings.requireAuth ? 'default' : 'secondary'}>
                            {selectedForm.settings.requireAuth ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Spam Protection</span>
                          <Badge variant={selectedForm.settings.enableSpamProtection ? 'default' : 'secondary'}>
                            {selectedForm.settings.enableSpamProtection ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                          <Badge variant={selectedForm.notifications.email ? 'default' : 'secondary'}>
                            {selectedForm.notifications.email ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Auto Response</span>
                          <Badge variant={selectedForm.notifications.autoResponse ? 'default' : 'secondary'}>
                            {selectedForm.notifications.autoResponse ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{selectedForm.submissions}</p>
                            <p className="text-sm text-gray-600">Total Submissions</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{selectedForm.conversionRate}%</p>
                            <p className="text-sm text-gray-600">Conversion Rate</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Performance Insights</h3>
                      <p className="text-gray-600">Detailed analytics dashboard coming soon...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FormInput className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a form to edit</h3>
                <p className="text-gray-600">Choose a form from the list to start editing or create a new one.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {forms.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FormInput className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first form to start collecting submissions from your website visitors.
            </p>
            <Button onClick={createForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Form
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormBuilder;
