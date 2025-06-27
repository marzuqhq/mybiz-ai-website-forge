
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
import { aiService } from '@/lib/ai';
import { 
  Plus, 
  Edit, 
  Trash2, 
  HelpCircle,
  Wand2,
  Save,
  Sparkles
} from 'lucide-react';

interface FAQ {
  id: string;
  websiteId: string;
  question: string;
  answer: string;
  aiGenerated: boolean;
}

interface FAQManagerProps {
  websiteId: string;
  businessInfo?: any;
}

const FAQManager: React.FC<FAQManagerProps> = ({ websiteId, businessInfo }) => {
  const { toast } = useToast();

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [editForm, setEditForm] = useState({
    question: '',
    answer: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadFAQs();
  }, [websiteId]);

  const loadFAQs = async () => {
    try {
      setIsLoading(true);
      const allFaqs = await sdk.get<FAQ>('faqs');
      const websiteFaqs = allFaqs.filter(f => f.websiteId === websiteId);
      setFaqs(websiteFaqs);
    } catch (error) {
      console.error('Failed to load FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFAQ = async () => {
    if (!editForm.question.trim() || !editForm.answer.trim()) {
      toast({
        title: "Validation error",
        description: "Both question and answer are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newFaq = await sdk.insert<FAQ>('faqs', {
        websiteId,
        question: editForm.question,
        answer: editForm.answer,
        aiGenerated: false
      });

      setFaqs([...faqs, newFaq]);
      setIsCreating(false);
      resetForm();
      
      toast({
        title: "FAQ created",
        description: "Your FAQ has been created successfully.",
      });
    } catch (error: any) {
      console.error('Create FAQ error:', error);
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create FAQ.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFAQ = async () => {
    if (!selectedFaq || !editForm.question.trim() || !editForm.answer.trim()) return;

    try {
      const updatedFaq = await sdk.update<FAQ>('faqs', selectedFaq.id, {
        question: editForm.question,
        answer: editForm.answer,
        aiGenerated: false
      });

      setFaqs(faqs.map(f => f.id === selectedFaq.id ? updatedFaq : f));
      setIsEditing(false);
      setSelectedFaq(null);
      resetForm();
      
      toast({
        title: "FAQ updated",
        description: "Your FAQ has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Update FAQ error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update FAQ.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFAQ = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await sdk.delete('faqs', faqId);
      setFaqs(faqs.filter(f => f.id !== faqId));
      
      toast({
        title: "FAQ deleted",
        description: "The FAQ has been deleted.",
      });
    } catch (error: any) {
      console.error('Delete FAQ error:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete FAQ.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateFAQs = async () => {
    try {
      setIsGenerating(true);
      
      const generatedFaqs = await aiService.generateFAQs(
        businessInfo?.type || 'business',
        businessInfo?.services?.split(',') || ['service']
      );

      // Add generated FAQs to database
      for (const faq of generatedFaqs) {
        const newFaq = await sdk.insert<FAQ>('faqs', {
          websiteId,
          question: faq.question,
          answer: faq.answer,
          aiGenerated: true
        });
        setFaqs(prev => [...prev, newFaq]);
      }

      toast({
        title: "FAQs generated",
        description: `Generated ${generatedFaqs.length} FAQs for your business.`,
      });
    } catch (error: any) {
      console.error('Generate FAQs error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate FAQs.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setEditForm({
      question: '',
      answer: '',
    });
  };

  const startEdit = (faq: FAQ) => {
    setSelectedFaq(faq);
    setEditForm({
      question: faq.question,
      answer: faq.answer
    });
    setIsEditing(true);
  };

  const startCreate = () => {
    resetForm();
    setIsCreating(true);
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
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-600">Help your visitors find answers quickly</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleGenerateFAQs}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                AI Generate
              </>
            )}
          </Button>
          <Button onClick={startCreate} className="bg-gradient-to-r from-blue-500 to-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* FAQs List */}
      {faqs.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your FAQs</CardTitle>
            <CardDescription>
              Click on any question to expand the answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-start space-x-3 text-left">
                        <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{faq.question}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {faq.aiGenerated && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-700 flex-1 pr-4">{faq.answer}</p>
                      <div className="flex space-x-2 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => startEdit(faq)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No FAQs yet</h3>
          <p className="text-gray-600 mb-4">
            Create FAQs to help your customers find answers quickly.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={handleGenerateFAQs}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Generate FAQs
                </>
              )}
            </Button>
            <Button onClick={startCreate} className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Manually
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedFaq(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Add New FAQ' : 'Edit FAQ'}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? 'Create a new frequently asked question' : 'Update the FAQ content'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={editForm.question}
                onChange={(e) => setEditForm({...editForm, question: e.target.value})}
                placeholder="What question do customers frequently ask?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer *</Label>
              <Textarea
                id="answer"
                value={editForm.answer}
                onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
                placeholder="Provide a helpful and detailed answer..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setSelectedFaq(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isCreating ? handleCreateFAQ : handleUpdateFAQ}
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Add FAQ' : 'Update FAQ'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQManager;
