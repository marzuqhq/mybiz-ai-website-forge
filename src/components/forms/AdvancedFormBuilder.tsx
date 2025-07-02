import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Settings, 
  Save, 
  Eye, 
  Copy, 
  Trash2, 
  Move, 
  Type, 
  Mail, 
  Phone, 
  Calendar, 
  FileText,
  CheckSquare,
  ToggleLeft,
  Star,
  Upload,
  Link
} from 'lucide-react';
import sdk from '@/lib/sdk';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'number' | 'url' | 'rating';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[];
  defaultValue?: string;
  conditionalLogic?: {
    showIf: {
      fieldId: string;
      value: string;
      operator: 'equals' | 'not_equals' | 'contains';
    };
  };
  helpText?: string;
  width: 'full' | 'half' | 'third';
}

interface FormSettings {
  submitMessage: string;
  redirectUrl: string;
  emailNotification: boolean;
  notificationEmail: string;
  requireCaptcha: boolean;
  allowMultipleSubmissions: boolean;
  submissionLimit?: number;
  customCss: string;
  theme: 'default' | 'minimal' | 'modern' | 'custom';
}

interface FormData {
  id?: string;
  websiteId: string;
  name: string;
  description: string;
  fields: FormField[];
  settings: FormSettings;
  status: 'draft' | 'published' | 'archived';
  slug: string;
  isMultiStep: boolean;
  steps?: {
    id: string;
    title: string;
    description?: string;
    fields: string[];
  }[];
}

interface AdvancedFormBuilderProps {
  websiteId: string;
  formId?: string;
  onSave?: (form: FormData) => void;
}

const AdvancedFormBuilder: React.FC<AdvancedFormBuilderProps> = ({ 
  websiteId, 
  formId, 
  onSave 
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState<FormData>({
    websiteId,
    name: '',
    description: '',
    fields: [],
    settings: {
      submitMessage: 'Thank you for your submission!',
      redirectUrl: '',
      emailNotification: false,
      notificationEmail: '',
      requireCaptcha: false,
      allowMultipleSubmissions: true,
      customCss: '',
      theme: 'default'
    },
    status: 'draft',
    slug: '',
    isMultiStep: false,
    steps: []
  });
  
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [isSlugAvailable, setIsSlugAvailable] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);

  useEffect(() => {
    if (formId) {
      loadForm(formId);
    }
  }, [formId]);

  const loadForm = async (id: string) => {
    try {
      const forms = await sdk.get('forms');
      const formData = forms.find((f: any) => f.id === id);
      if (formData) {
        setForm(formData);
      }
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: "Error",
        description: "Failed to load form",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug === form.slug) {
      setIsSlugAvailable(true);
      return;
    }

    setCheckingSlug(true);
    try {
      const forms = await sdk.get('forms');
      const exists = forms.some((f: any) => f.slug === slug && f.id !== formId);
      setIsSlugAvailable(!exists);
    } catch (error) {
      console.error('Error checking slug:', error);
      setIsSlugAvailable(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleNameChange = (name: string) => {
    setForm(prev => {
      const newSlug = generateSlug(name);
      checkSlugAvailability(newSlug);
      return { 
        ...prev, 
        name,
        slug: newSlug
      };
    });
  };

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      width: 'full'
    };

    if (type === 'select' || type === 'radio') {
      newField.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
    setSelectedField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...form.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setForm(prev => ({ ...prev, fields: newFields }));
  };

  const saveForm = async () => {
    if (!form.name.trim()) {
      toast({
        title: "Error",
        description: "Form name is required",
        variant: "destructive",
      });
      return;
    }

    if (!isSlugAvailable) {
      toast({
        title: "Error", 
        description: "Form URL is not available",
        variant: "destructive",
      });
      return;
    }

    try {
      let savedForm;
      if (formId) {
        savedForm = await sdk.update('forms', formId, form);
      } else {
        savedForm = await sdk.insert('forms', form);
      }
      
      toast({
        title: "Success",
        description: `Form ${formId ? 'updated' : 'created'} successfully`,
      });
      
      onSave?.(savedForm);
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive",
      });
    }
  };

  const copyFormUrl = () => {
    const baseUrl = window.location.origin;
    const formUrl = `${baseUrl}/forms/${form.slug}`;
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "URL Copied!",
      description: "Form URL copied to clipboard",
    });
  };

  const getFieldIcon = (type: FormField['type']) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'textarea': return <FileText className="w-4 h-4" />;
      case 'select': case 'radio': return <CheckSquare className="w-4 h-4" />;
      case 'checkbox': return <CheckSquare className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'file': return <Upload className="w-4 h-4" />;
      case 'url': return <Link className="w-4 h-4" />;
      case 'rating': return <Star className="w-4 h-4" />;
      default: return <Type className="w-4 h-4" />;
    }
  };

  const fieldTypes: { type: FormField['type']; label: string }[] = [
    { type: 'text', label: 'Text Input' },
    { type: 'email', label: 'Email' },
    { type: 'phone', label: 'Phone' },
    { type: 'textarea', label: 'Text Area' },
    { type: 'select', label: 'Dropdown' },
    { type: 'radio', label: 'Radio Buttons' },
    { type: 'checkbox', label: 'Checkboxes' },
    { type: 'date', label: 'Date Picker' },
    { type: 'number', label: 'Number' },
    { type: 'file', label: 'File Upload' },
    { type: 'url', label: 'URL' },
    { type: 'rating', label: 'Rating' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen overflow-hidden">
      {/* Form Builder Panel */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Form Builder</CardTitle>
              <div className="flex items-center gap-2">
                <Button onClick={saveForm} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Form
                </Button>
                {form.slug && (
                  <Button onClick={copyFormUrl} variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto">
            <Tabs defaultValue="design" className="h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="design" className="space-y-4">
                {/* Form Basic Info */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="formName">Form Name</Label>
                    <Input
                      id="formName"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Contact Form"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="formSlug">Form URL</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{window.location.origin}/forms/</span>
                      <Input
                        id="formSlug"
                        value={form.slug}
                        onChange={(e) => {
                          setForm(prev => ({ ...prev, slug: e.target.value }));
                          checkSlugAvailability(e.target.value);
                        }}
                        placeholder="contact-form"
                        className={!isSlugAvailable ? 'border-red-500' : ''}
                      />
                      {checkingSlug && <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-blue-600 rounded-full" />}
                    </div>
                    {!isSlugAvailable && (
                      <p className="text-sm text-red-600 mt-1">This URL is already taken</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="formDescription">Description</Label>
                    <Textarea
                      id="formDescription"
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of this form"
                    />
                  </div>
                </div>

                {/* Field Types Toolbar */}
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">Add Fields</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {fieldTypes.map((fieldType) => (
                      <Button
                        key={fieldType.type}
                        variant="outline"
                        size="sm"
                        onClick={() => addField(fieldType.type)}
                        className="justify-start"
                      >
                        {getFieldIcon(fieldType.type)}
                        <span className="ml-2 text-xs">{fieldType.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2">
                  {form.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`p-3 border rounded-lg cursor-pointer hover:border-blue-300 ${
                        selectedField?.id === field.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedField(field)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getFieldIcon(field.type)}
                          <span className="font-medium">{field.label}</span>
                          {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedField(field);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeField(field.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                {/* Form Settings */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="submitMessage">Success Message</Label>
                    <Textarea
                      id="submitMessage"
                      value={form.settings.submitMessage}
                      onChange={(e) => setForm(prev => ({
                        ...prev,
                        settings: { ...prev.settings, submitMessage: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="redirectUrl">Redirect URL (optional)</Label>
                    <Input
                      id="redirectUrl"
                      value={form.settings.redirectUrl}
                      onChange={(e) => setForm(prev => ({
                        ...prev,
                        settings: { ...prev.settings, redirectUrl: e.target.value }
                      }))}
                      placeholder="https://example.com/thank-you"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotification">Email Notifications</Label>
                    <Switch
                      id="emailNotification"
                      checked={form.settings.emailNotification}
                      onCheckedChange={(checked) => setForm(prev => ({
                        ...prev,
                        settings: { ...prev.settings, emailNotification: checked }
                      }))}
                    />
                  </div>
                  
                  {form.settings.emailNotification && (
                    <div>
                      <Label htmlFor="notificationEmail">Notification Email</Label>
                      <Input
                        id="notificationEmail"
                        type="email"
                        value={form.settings.notificationEmail}
                        onChange={(e) => setForm(prev => ({
                          ...prev,
                          settings: { ...prev.settings, notificationEmail: e.target.value }
                        }))}
                        placeholder="admin@example.com"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-4">{form.name}</h3>
                  {form.description && <p className="text-gray-600 mb-4">{form.description}</p>}
                  
                  <div className="space-y-4">
                    {form.fields.map((field) => (
                      <div key={field.id} className="space-y-1">
                        <Label>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea placeholder={field.placeholder} />
                        ) : field.type === 'select' ? (
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder={field.placeholder || 'Select an option'} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option, index) => (
                                <SelectItem key={index} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input type={field.type} placeholder={field.placeholder} />
                        )}
                        {field.helpText && (
                          <p className="text-sm text-gray-500">{field.helpText}</p>
                        )}
                      </div>
                    ))}
                    
                    <Button type="submit" className="w-full">
                      Submit Form
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Field Settings Panel */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              {selectedField ? 'Field Settings' : 'Select a Field'}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-y-auto">
            {selectedField && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fieldLabel">Label</Label>
                  <Input
                    id="fieldLabel"
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                  <Input
                    id="fieldPlaceholder"
                    value={selectedField.placeholder || ''}
                    onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fieldHelpText">Help Text</Label>
                  <Input
                    id="fieldHelpText"
                    value={selectedField.helpText || ''}
                    onChange={(e) => updateField(selectedField.id, { helpText: e.target.value })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="fieldRequired">Required Field</Label>
                  <Switch
                    id="fieldRequired"
                    checked={selectedField.required}
                    onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fieldWidth">Field Width</Label>
                  <Select 
                    value={selectedField.width} 
                    onValueChange={(value) => updateField(selectedField.id, { width: value as 'full' | 'half' | 'third' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Width</SelectItem>
                      <SelectItem value="half">Half Width</SelectItem>
                      <SelectItem value="third">Third Width</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(selectedField.type === 'select' || selectedField.type === 'radio') && (
                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {selectedField.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(selectedField.options || [])];
                              newOptions[index] = e.target.value;
                              updateField(selectedField.id, { options: newOptions });
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = selectedField.options?.filter((_, i) => i !== index);
                              updateField(selectedField.id, { options: newOptions });
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
                          const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                          updateField(selectedField.id, { options: newOptions });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Validation Settings */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Validation</h4>
                  
                  {selectedField.type === 'text' && (
                    <>
                      <div>
                        <Label htmlFor="minLength">Minimum Length</Label>
                        <Input
                          id="minLength"
                          type="number"
                          value={selectedField.validation?.minLength || ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, minLength: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxLength">Maximum Length</Label>
                        <Input
                          id="maxLength"
                          type="number"
                          value={selectedField.validation?.maxLength || ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, maxLength: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                    </>
                  )}
                  
                  {selectedField.type === 'number' && (
                    <>
                      <div>
                        <Label htmlFor="minValue">Minimum Value</Label>
                        <Input
                          id="minValue"
                          type="number"
                          value={selectedField.validation?.min || ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, min: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxValue">Maximum Value</Label>
                        <Input
                          id="maxValue"
                          type="number"
                          value={selectedField.validation?.max || ''}
                          onChange={(e) => updateField(selectedField.id, {
                            validation: { ...selectedField.validation, max: parseInt(e.target.value) || undefined }
                          })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedFormBuilder;