
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import sdk from '@/lib/sdk';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface Form {
  id: string;
  websiteId: string;
  name: string;
  description: string;
  fields: FormField[];
  settings: {
    submitMessage: string;
    redirectUrl: string;
    emailNotifications: boolean;
  };
}

interface Website {
  id: string;
  name: string;
  slug: string;
  businessInfo: any;
}

const PublicFormPage: React.FC = () => {
  const { websiteSlug, formSlug } = useParams();
  const { toast } = useToast();
  const [form, setForm] = useState<Form | null>(null);
  const [website, setWebsite] = useState<Website | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFormData();
  }, [websiteSlug, formSlug]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      
      // Get website
      const websites = await sdk.get('websites');
      const currentWebsite = websites.find((w: any) => w.slug === websiteSlug);
      if (!currentWebsite) {
        throw new Error('Website not found');
      }
      setWebsite(currentWebsite);

      // Get form
      const forms = await sdk.get('forms');
      const currentForm = forms.find((f: any) => 
        f.websiteId === currentWebsite.id && f.slug === formSlug
      );
      if (!currentForm) {
        throw new Error('Form not found');
      }
      setForm(currentForm);

      // Initialize form data
      const initialData: Record<string, any> = {};
      currentForm.fields.forEach((field: FormField) => {
        initialData[field.name] = '';
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate required fields
    const missingFields = form.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit form data
      await sdk.insert('form_submissions', {
        formId: form.id,
        data: formData,
        ipAddress: '', // Would be filled by server in real implementation
        userAgent: navigator.userAgent,
        status: 'new'
      });

      // Update form submission count
      const forms = await sdk.get('forms');
      const currentForm = forms.find((f: any) => f.id === form.id);
      if (currentForm) {
        await sdk.update('forms', form.id, {
          submissions: (currentForm.submissions || 0) + 1
        });
      }

      setIsSubmitted(true);
      toast({
        title: "Form submitted successfully!",
        description: form.settings.submitMessage || "Thank you for your submission.",
      });

      // Redirect if specified
      if (form.settings.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings.redirectUrl;
        }, 2000);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            rows={4}
          />
        );
      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              required={field.required}
              className="rounded border-gray-300 focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      default:
        return (
          <Input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form || !website) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Form Not Found</h1>
          <p className="text-muted-foreground">The requested form could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{form.name} - {website.businessInfo?.name || website.name}</title>
        <meta name="description" content={form.description} />
      </Helmet>

      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{form.name}</h1>
            {form.description && (
              <p className="text-muted-foreground">{form.description}</p>
            )}
          </div>

          {isSubmitted ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
                <p className="text-muted-foreground">
                  {form.settings.submitMessage || "Your form has been submitted successfully."}
                </p>
                {form.settings.redirectUrl && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Redirecting you shortly...
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Fill out the form below</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {form.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderField(field)}
                    </div>
                  ))}

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Form'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Powered by {website.businessInfo?.name || website.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicFormPage;
