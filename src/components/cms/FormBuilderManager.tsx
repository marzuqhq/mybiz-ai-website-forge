
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Settings, 
  Eye,
  Type,
  Mail,
  Phone,
  Calendar,
  Check,
  List,
  Upload,
  User,
  Building,
  Globe,
  MessageSquare
} from 'lucide-react';
import sdk from '@/lib/sdk';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  settings?: {
    multiple?: boolean;
    allowOther?: boolean;
    maxFiles?: number;
    acceptedTypes?: string[];
  };
}

interface FormSettings {
  submitMessage: string;
  redirectUrl: string;
  emailNotification: boolean;
  notificationEmail: string;
  saveToCRM: boolean;
  crmMapping: Record<string, string>;
  requireCaptcha: boolean;
  allowMultipleSubmissions: boolean;
}

interface FormBuilderManagerProps {
  websiteId: string;
}

const FormBuilderManager: React.FC<FormBuilderManagerProps> = ({ websiteId }) => {
  const [forms, setForms] = useState<any[]>([]);
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [formSettings, setFormSettings] = useState<FormSettings>({
    submitMessage: 'Thank you for your submission!',
    redirectUrl: '',
    emailNotification: false,
    notificationEmail: '',
    saveToCRM: false,
    crmMapping: {},
    requireCaptcha: false,
    allowMultipleSubmissions: true
  });
  const [formSubmissions, setFormSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'builder' | 'settings' | 'submissions'>('builder');
  const { toast } = useToast();

  const fieldTypes = [
    { value: 'text', label: 'Text Input', icon: Type },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'number', label: 'Number', icon: Type },
    { value: 'textarea', label: 'Long Text', icon: MessageSquare },
    { value: 'select', label: 'Dropdown', icon: List },
    { value: 'radio', label: 'Radio Buttons', icon: Check },
    { value: 'checkbox', label: 'Checkboxes', icon: Check },
    { value: 'date', label: 'Date', icon: Calendar },
    { value: 'file', label: 'File Upload', icon: Upload },
    { value: 'name', label: 'Full Name', icon: User },
    { value: 'company', label: 'Company', icon: Building },
    { value: 'website', label: 'Website URL', icon: Globe }
  ];

  useEffect(() => {
    loadForms();
  }, [websiteId]);

  useEffect(() => {
    if (selectedForm) {
      loadFormSubmissions();
    }
  }, [selectedForm]);

  const loadForms = async () => {
    try {
      setIsLoading(true);
      const allForms = await sdk.get('forms');
      const websiteForms = allForms.filter(form => form.websiteId === websiteId);
      setForms(websiteForms);
      
      if (websiteForms.length > 0 && !selectedForm) {
        selectForm(websiteForms[0]);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
      toast({
        title: "Error",
        description: "Failed to load forms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFormSubmissions = async () => {
    if (!selectedForm) return;
    
    try {
      const submissions = await sdk.get('form_submissions');
      const formSubmissions = submissions.filter(sub => sub.formId === selectedForm.id);
      setFormSubmissions(formSubmissions);
    } catch (error) {
      console.error('Error loading form submissions:', error);
    }
  };

  const selectForm = (form: any) => {
    setSelectedForm(form);
    setFormFields(form.fields || []);
    setFormSettings({
      submitMessage: form.settings?.submitMessage || 'Thank you for your submission!',
      redirectUrl: form.settings?.redirectUrl || '',
      emailNotification: form.settings?.emailNotification || false,
      notificationEmail: form.settings?.notificationEmail || '',
      saveToCRM: form.settings?.saveToCRM || false,
      crmMapping: form.settings?.crmMapping || {},
      requireCaptcha: form.settings?.requireCaptcha || false,
      allowMultipleSubmissions: form.settings?.allowMultipleSubmissions || true
    });
  };

  const createForm = async () => {
    try {
      const newForm = await sdk.insert('forms', {
        websiteId,
        name: 'New Form',
        fields: [
          {
            id: 'name',
            type: 'name',
            label: 'Your Name',
            required: true
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            required: true
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            required: false
          }
        ],
        settings: {
          submitMessage: 'Thank you for your submission!',
          emailNotification: false,
          saveToCRM: false,
          allowMultipleSubmissions: true
        },
        slug: `form-${Date.now()}`,
        status: 'active'
      });

      setForms([...forms, newForm]);
      selectForm(newForm);
      
      toast({
        title: "Form Created",
        description: "New form created successfully",
      });
    } catch (error) {
      console.error('Error creating form:', error);
      toast({
        title: "Error",
        description: "Failed to create form",
        variant: "destructive",
      });
    }
  };

  const saveForm = async () => {
    if (!selectedForm) return;

    try {
      const updatedForm = await sdk.update('forms', selectedForm.id, {
        fields: formFields,
        settings: formSettings,
        updatedAt: new Date().toISOString()
      });

      setForms(forms.map(f => f.id === selectedForm.id ? updatedForm : f));
      setSelectedForm(updatedForm);
      
      toast({
        title: "Form Saved",
        description: "Form updated successfully",
      });
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      });
    }
  };

  const addField = (type: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `${fieldTypes.find(ft => ft.value === type)?.label || 'Field'}`,
      required: false,
      ...(type === 'select' || type === 'radio' || type === 'checkbox' ? { options: ['Option 1', 'Option 2'] } : {}),
      ...(type === 'file' ? { settings: { maxFiles: 1, acceptedTypes: ['image/*', 'application/pdf'] } } : {})
    };

    setFormFields([...formFields, newField]);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const removeField = (fieldId: string) => {
    setFormFields(formFields.filter(field => field.id !== fieldId));
  };

  const getPublicFormUrl = (form: any) => {
    return `https://mybiz.top/form/${form.slug}`;
  };

  const copyFormUrl = (form: any) => {
    const url = getPublicFormUrl(form);
    navigator.clipboard.writeText(url);
    toast({
      title: "URL Copied",
      description: "Form URL copied to clipboard",
    });
  };

  const exportSubmissions = () => {
    if (formSubmissions.length === 0) return;

    const csvContent = [
      // Header
      ['Submission Date', ...formFields.map(field => field.label)].join(','),
      // Data
      ...formSubmissions.map(submission => [
        new Date(submission.createdAt).toLocaleDateString(),
        ...formFields.map(field => submission.data[field.id] || '')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedForm.name}-submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Form Builder</h2>
          <p className="text-gray-600">Create and manage custom forms for your website</p>
        </div>
        <Button onClick={createForm}>
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Forms List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map(form => (
          <Card 
            key={form.id}
            className={`cursor-pointer transition-all ${selectedForm?.id === form.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => selectForm(form)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{form.name}</CardTitle>
                <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                  {form.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {form.fields?.length || 0} fields • {form.submissions?.length || 0} submissions
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyFormUrl(form);
                    }}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(getPublicFormUrl(form), '_blank');
                    }}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Editor */}
      {selectedForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Edit Form: {selectedForm.name}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveTab('builder')}>
                  Builder
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('submissions')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Submissions ({formSubmissions.length})
                </Button>
                <Button onClick={saveForm}>
                  Save Form
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'builder' && (
              <div className="space-y-6">
                {/* Form Name */}
                <div>
                  <Label>Form Name</Label>
                  <Input
                    value={selectedForm.name}
                    onChange={(e) => setSelectedForm({...selectedForm, name: e.target.value})}
                  />
                </div>

                {/* Field Types */}
                <div>
                  <Label className="text-base font-semibold">Add Fields</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {fieldTypes.map(fieldType => (
                      <Button
                        key={fieldType.value}
                        variant="outline"
                        onClick={() => addField(fieldType.value)}
                        className="flex items-center gap-2"
                      >
                        <fieldType.icon className="w-4 h-4" />
                        {fieldType.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Form Fields</Label>
                  {formFields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline">{fieldTypes.find(ft => ft.value === field.type)?.label}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label>Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                            />
                          </div>
                          
                          <div>
                            <Label>Placeholder</Label>
                            <Input
                              value={field.placeholder || ''}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.required}
                              onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                            />
                            <Label>Required</Label>
                          </div>
                        </div>

                        {/* Options for select/radio/checkbox */}
                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                          <div className="mt-4">
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {field.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(field.options || [])];
                                      newOptions[optionIndex] = e.target.value;
                                      updateField(field.id, { options: newOptions });
                                    }}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newOptions = field.options?.filter((_, i) => i !== optionIndex);
                                      updateField(field.id, { options: newOptions });
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newOptions = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
                                  updateField(field.id, { options: newOptions });
                                }}
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <Label>Success Message</Label>
                  <Textarea
                    value={formSettings.submitMessage}
                    onChange={(e) => setFormSettings({...formSettings, submitMessage: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Redirect URL (optional)</Label>
                  <Input
                    value={formSettings.redirectUrl}
                    onChange={(e) => setFormSettings({...formSettings, redirectUrl: e.target.value})}
                    placeholder="https://example.com/thank-you"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formSettings.emailNotification}
                    onCheckedChange={(checked) => setFormSettings({...formSettings, emailNotification: checked})}
                  />
                  <Label>Send email notifications</Label>
                </div>

                {formSettings.emailNotification && (
                  <div>
                    <Label>Notification Email</Label>
                    <Input
                      type="email"
                      value={formSettings.notificationEmail}
                      onChange={(e) => setFormSettings({...formSettings, notificationEmail: e.target.value})}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formSettings.saveToCRM}
                    onCheckedChange={(checked) => setFormSettings({...formSettings, saveToCRM: checked})}
                  />
                  <Label>Save submissions to CRM</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formSettings.allowMultipleSubmissions}
                    onCheckedChange={(checked) => setFormSettings({...formSettings, allowMultipleSubmissions: checked})}
                  />
                  <Label>Allow multiple submissions from same user</Label>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Form Submissions</h3>
                  {formSubmissions.length > 0 && (
                    <Button variant="outline" onClick={exportSubmissions}>
                      Export CSV
                    </Button>
                  )}
                </div>

                {formSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No submissions yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 p-2 text-left">Date</th>
                          {formFields.map(field => (
                            <th key={field.id} className="border border-gray-200 p-2 text-left">
                              {field.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {formSubmissions.map(submission => (
                          <tr key={submission.id}>
                            <td className="border border-gray-200 p-2">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </td>
                            {formFields.map(field => (
                              <td key={field.id} className="border border-gray-200 p-2">
                                {submission.data[field.id] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormBuilderManager;
