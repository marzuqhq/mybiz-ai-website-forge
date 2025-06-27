
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, HelpCircle, Sparkles, Save } from 'lucide-react';
import sdk from '@/lib/sdk';
import { aiService } from '@/lib/ai';

interface FAQ {
  id: string;
  websiteId: string;
  question: string;
  answer: string;
  aiGenerated: boolean;
  category: string;
}

interface FAQManagerProps {
  websiteId: string;
  businessInfo: any;
}

const FAQManager: React.FC<FAQManagerProps> = ({ websiteId, businessInfo }) => {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general'
  });

  useEffect(() => {
    loadFAQs();
  }, [websiteId]);

  const loadFAQs = async () => {
    try {
      setIsLoading(true);
      const allFaqs = await sdk.get<FAQ>('faqs');
      const websiteFaqs = allFaqs.filter(faq => faq.websiteId === websiteId);
      setFaqs(websiteFaqs);
    } catch (error: any) {
      toast({
        title: "Error loading FAQs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both question and answer.",
        variant: "destructive",
      });
      return;
    }

    try {
      const faqData = {
        websiteId,
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        aiGenerated: false
      };

      if (editingFaq) {
        await sdk.update('faqs', editingFaq.id, faqData);
        toast({
          title: "FAQ updated",
          description: "FAQ has been updated successfully.",
        });
      } else {
        await sdk.insert('faqs', faqData);
        toast({
          title: "FAQ created",
          description: "FAQ has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingFaq(null);
      setFormData({ question: '', answer: '', category: 'general' });
      loadFAQs();
    } catch (error: any) {
      toast({
        title: "Error saving FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await sdk.delete('faqs', faqId);
      toast({
        title: "FAQ deleted",
        description: "FAQ has been deleted successfully.",
      });
      loadFAQs();
    } catch (error: any) {
      toast({
        title: "Error deleting FAQ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generateAnswer = async () => {
    if (!formData.question.trim()) {
      toast({
        title: "Question required",
        description: "Please enter a question first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const aiAnswer = await aiService.editContent(
        formData.question,
        `Generate a helpful answer for this FAQ question about ${businessInfo?.businessType || 'our business'}: "${formData.question}"`
      );
      
      setFormData(prev => ({ ...prev, answer: aiAnswer }));
      
      toast({
        title: "Answer generated",
        description: "AI has generated an answer for your question.",
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

  const generateCommonFAQs = async () => {
    try {
      setIsGenerating(true);
      const commonFaqs = await aiService.generateFAQs(businessInfo);
      
      // Add all generated FAQs
      for (const faq of commonFaqs) {
        await sdk.insert('faqs', {
          websiteId,
          question: faq.question,
          answer: faq.answer,
          category: 'general',
          aiGenerated: true
        });
      }

      loadFAQs();
      
      toast({
        title: "FAQs generated",
        description: `Generated ${commonFaqs.length} common FAQs for your business.`,
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

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: 'general' });
    setEditingFaq(null);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
          <p className="text-gray-600">Manage frequently asked questions</p>
        </div>
        <div className="flex space-x-2">
          {faqs.length === 0 && (
            <Button 
              onClick={generateCommonFAQs}
              disabled={isGenerating}
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Common FAQs'}
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                New FAQ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
                </DialogTitle>
                <DialogDescription>
                  {editingFaq ? 'Update your FAQ' : 'Add a new frequently asked question'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question</label>
                  <Input
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="What is your most common question?"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Answer</label>
                    <Button 
                      onClick={generateAnswer}
                      disabled={isGenerating || !formData.question}
                      variant="outline"
                      size="sm"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {isGenerating ? 'Generating...' : 'AI Generate'}
                    </Button>
                  </div>
                  <Textarea
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Provide a helpful answer..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="pricing">Pricing</option>
                    <option value="services">Services</option>
                    <option value="support">Support</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    <Save className="w-4 h-4 mr-2" />
                    {editingFaq ? 'Update FAQ' : 'Create FAQ'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* FAQs List */}
      {faqs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs yet</h3>
            <p className="text-gray-600 mb-6">
              Create FAQs to help answer common questions from your visitors.
            </p>
            <div className="flex justify-center space-x-3">
              <Button onClick={generateCommonFAQs} variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Common FAQs
              </Button>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Create First FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <CardDescription className="mt-1">
                      Category: {faq.category}
                      {faq.aiGenerated && (
                        <span className="ml-2 inline-flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Generated
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(faq.id)}
                      className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQManager;
