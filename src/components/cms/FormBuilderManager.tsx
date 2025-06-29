
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FormInput, Eye, Settings, BarChart3 } from 'lucide-react';
import sdk from '@/lib/sdk';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface Form {
  id: string;
  websiteId: string;
  name: string;
  fields: FormField[];
  settings: {
    redirectUrl?: string;
    emailNotification: boolean;
    notificationEmail: string;
    submitMessage: string;
  };
  submissions: any[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface FormBuilderManagerProps {
  websiteId: string;
}

const FormBuilderManager: React.FC<FormBuilderManagerProps> = ({ websiteId }) => {
  const { toast } = useToast();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    fields: [] as FormField[],
    settings: {
      submitMessage: 'Thank you for your submission!',
      emailNotification: false,
      notificationEmail: ''
    }
  });

  useEffect(() => {
    loadForms();
  }, [websiteId]);

  const loadForms = async () => {
    try {
      setIsLoading(true);
      const allForms = await sdk.get<Form>('forms');
      const websiteForms = allForms.filter(form => form.websiteId === websiteId);
      setForms(websiteForms);
    } catch (error: any) {
      toast({
        title: "Error loading forms",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFieldId = () => {
    return 'field_' + Math.random().toString(36).substr(2, 9);
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: generateFieldId(),
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      placeholder: type === 'textarea' ? 'Enter your message...' : `Enter ${type}...`,
      ...(type === 'select' || type === 'radio' ? { options: ['Option 1', 'Option 2'] } : {})
    };

    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || formData.fields.length === 0) {
      toast({
        title: "Required fields missing",
        description: "Please enter form name and add at least one field.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSave = {
        websiteId,
        name: formData.name,
        fields: formData.fields,
        settings: {
          submitMessage: formData.settings.submitMessage,
          emailNotification: formData.settings.emailNotification,
          notificationEmail: formData.settings.notificationEmail || '',
          redirectUrl: ''
        },
        submissions: [],
        status: 'active' as const
      };

      if (editingForm) {
        await sdk.update('forms', editingForm.id, formDataToSave);
        toast({
          title: "Form updated",
          description: "Form has been updated successfully.",
        });
      } else {
        await sdk.insert('forms', formDataToSave);
        toast({
          title: "Form created",
          description: "Form has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingForm(null);
      resetForm();
      loadForms();
    } catch (error: any) {
      toast({
        title: "Error saving form",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (form: Form) => {
    setEditingForm(form);
    setFormData({
      name: form.name,
      fields: form.fields,
      settings: {
        submitMessage: form.settings.submitMessage,
        emailNotification: form.settings.emailNotification,
        notificationEmail: form.settings.notificationEmail
      }
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;

    try {
      await sdk.delete('forms', formId);
      toast({
        title: "Form deleted",
        description: "Form has been deleted successfully.",
      });
      loadForms();
    } catch (error: any) {
      toast({
        title: "Error deleting form",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      fields: [],
      settings: {
        submitMessage: 'Thank you for your submission!',
        emailNotification: false,
        notificationEmail: ''
      }
    });
    setEditingForm(null);
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
          <h2 className="text-2xl font-bold text-gray-900">Form Builder</h2>
          <p className="text-gray-600">Create and manage custom forms</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600">
              <Plus className="w-4 h-4 mr-2" />
              New Form
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingForm ? 'Edit Form' : 'Create New Form'}
              </DialogTitle>
              <DialogDescription>
                {editingForm ? 'Update your form configuration' : 'Build a custom form for your website'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Form Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter form name..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Form Fields</label>
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => addField('text')}>
                      Text
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addField('email')}>
                      Email
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addField('textarea')}>
                      Textarea
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addField('select')}>
                      Select
                    </Button>
                  </div>
                </div>
                
                {formData.fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-3">
                        <label className="text-xs text-gray-500">Type</label>
                        <Select value={field.type} onValueChange={(value: any) => updateField(field.id, { type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="radio">Radio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <label className="text-xs text-gray-500">Label</label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                          placeholder="Field label"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-gray-500">Placeholder</label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          placeholder="Placeholder text"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs text-gray-500">Required</label>
                        <div className="flex items-center space-x-2 pt-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          />
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button type="button" variant="outline" size="sm" onClick={() => removeField(field.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {(field.type === 'select' || field.type === 'radio') && (
                      <div className="mt-4">
                        <label className="text-xs text-gray-500">Options (one per line)</label>
                        <textarea
                          className="w-full mt-1 p-2 border rounded text-sm"
                          rows={3}
                          value={(field.options || []).join('\n')}
                          onChange={(e) => updateField(field.id, { options: e.target.value.split('\n').filter(Boolean) })}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                        />
                      </div>
                    )}
                  </Card>
                ))}

                {formData.fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No fields added yet. Click the buttons above to add form fields.
                  </div>
                )}
              </div>

              <Card className="p-4">
                <h4 className="font-medium mb-4">Form Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Success Message</label>
                    <Input
                      value={formData.settings.submitMessage}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, submitMessage: e.target.value }
                      }))}
                      placeholder="Thank you message"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.settings.emailNotification}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, emailNotification: e.target.checked }
                      }))}
                    />
                    <label className="text-sm">Send email notifications</label>
                  </div>
                  {formData.settings.emailNotification && (
                    <div>
                      <label className="text-sm font-medium">Notification Email</label>
                      <Input
                        type="email"
                        value={formData.settings.notificationEmail}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, notificationEmail: e.target.value }
                        }))}
                        placeholder="notifications@example.com"
                      />
                    </div>
                  )}
                </div>
              </Card>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingForm ? 'Update Form' : 'Create Form'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {forms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FormInput className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-600 mb-6">
              Create custom forms to collect information from your visitors.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-orange-500 to-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Create First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{form.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {form.fields.length} fields • {form.submissions.length} submissions
                    </CardDescription>
                  </div>
                  <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
                    {form.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">
                    Fields: {form.fields.map(f => f.label).join(', ')}
                  </div>
                  <div className="text-sm text-gray-600">
                    Created: {new Date(form.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(form)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                  >
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Stats
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(form.id)}
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

export default FormBuilderManager;
