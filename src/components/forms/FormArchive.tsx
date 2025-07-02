import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  BarChart3,
  ExternalLink,
  FileText,
  Calendar
} from 'lucide-react';
import sdk from '@/lib/sdk';
import AdvancedFormBuilder from './AdvancedFormBuilder';

interface Form {
  id: string;
  websiteId: string;
  name: string;
  description: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  fields: any[];
  submissions: any[];
  createdAt: string;
  updatedAt: string;
}

interface FormArchiveProps {
  websiteId: string;
}

const FormArchive: React.FC<FormArchiveProps> = ({ websiteId }) => {
  const { toast } = useToast();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState<string | null>(null);

  useEffect(() => {
    loadForms();
  }, [websiteId]);

  const loadForms = async () => {
    try {
      setLoading(true);
      const allForms = await sdk.get('forms');
      const websiteForms = allForms.filter((form: any) => form.websiteId === websiteId);
      setForms(websiteForms);
    } catch (error) {
      console.error('Error loading forms:', error);
      toast({
        title: "Error",
        description: "Failed to load forms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateForm = () => {
    setEditingForm(null);
    setShowBuilder(true);
  };

  const handleEditForm = (formId: string) => {
    setEditingForm(formId);
    setShowBuilder(true);
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }

    try {
      await sdk.delete('forms', formId);
      await loadForms();
      toast({
        title: "Success",
        description: "Form deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateForm = async (form: Form) => {
    try {
      const duplicatedForm = {
        ...form,
        name: `${form.name} (Copy)`,
        slug: `${form.slug}-copy-${Date.now()}`,
        status: 'draft' as const,
        submissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      delete duplicatedForm.id;

      await sdk.insert('forms', duplicatedForm);
      await loadForms();
      toast({
        title: "Success",
        description: "Form duplicated successfully",
      });
    } catch (error) {
      console.error('Error duplicating form:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate form",
        variant: "destructive",
      });
    }
  };

  const copyFormUrl = (form: Form) => {
    const baseUrl = window.location.origin;
    const formUrl = `${baseUrl}/forms/${form.slug}`;
    navigator.clipboard.writeText(formUrl);
    toast({
      title: "URL Copied!",
      description: "Form URL copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormStats = (form: Form) => {
    const submissionCount = form.submissions?.length || 0;
    const fieldCount = form.fields?.length || 0;
    const lastSubmission = form.submissions?.length > 0 
      ? new Date(Math.max(...form.submissions.map((s: any) => new Date(s.createdAt).getTime())))
      : null;

    return { submissionCount, fieldCount, lastSubmission };
  };

  if (showBuilder) {
    return (
      <div className="h-full">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => {
              setShowBuilder(false);
              setEditingForm(null);
            }}
          >
            ← Back to Forms
          </Button>
        </div>
        <AdvancedFormBuilder
          websiteId={websiteId}
          formId={editingForm || undefined}
          onSave={() => {
            setShowBuilder(false);
            setEditingForm(null);
            loadForms();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Forms</h2>
          <p className="text-gray-600">Manage your website forms and submissions</p>
        </div>
        <Button onClick={handleCreateForm}>
          <Plus className="w-4 h-4 mr-2" />
          Create Form
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Forms Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredForms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No forms match your search.' : 'Get started by creating your first form.'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateForm}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Form
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => {
            const stats = getFormStats(form);
            return (
              <Card key={form.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold">{form.name}</CardTitle>
                      {form.description && (
                        <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditForm(form.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyFormUrl(form)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateForm(form)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => window.open(`/forms/${form.slug}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteForm(form.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(form.status)}>
                        {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        /{form.slug}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Fields</div>
                        <div className="font-semibold">{stats.fieldCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Submissions</div>
                        <div className="font-semibold">{stats.submissionCount}</div>
                      </div>
                    </div>

                    {/* Last Activity */}
                    {stats.lastSubmission && (
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last submission: {stats.lastSubmission.toLocaleDateString()}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditForm(form.id)}
                        className="flex-1"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/forms/${form.slug}`, '_blank')}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FormArchive;