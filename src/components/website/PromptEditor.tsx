
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wand2, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
  aiGenerated: boolean;
}

interface PromptEditorProps {
  block: Block;
  onEdit: (blockId: string, prompt: string) => Promise<void>;
  isSaving: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  block,
  onEdit,
  isSaving
}) => {
  const [prompt, setPrompt] = useState('');
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  const suggestions = {
    hero: [
      "Make the headline more compelling and action-oriented",
      "Add urgency to the call-to-action button",
      "Make the description more benefit-focused"
    ],
    about: [
      "Add more personality and storytelling",
      "Include company achievements or milestones",
      "Make it more conversational and relatable"
    ],
    services: [
      "Add pricing information to services",
      "Include customer benefits for each service",
      "Add testimonials or social proof"
    ],
    contact: [
      "Add business hours information",
      "Include social media links",
      "Add a map or location details"
    ]
  };

  const handleSubmit = async (promptText: string) => {
    if (!promptText.trim()) return;

    setPromptHistory(prev => [promptText, ...prev.slice(0, 4)]);
    await onEdit(block.id, promptText);
    setPrompt('');
  };

  const handleQuickPrompt = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {block.type} Section
          </h3>
          {block.aiGenerated && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600">
          Use natural language to describe how you want to improve this section.
        </p>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Current Content Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              {block.content?.headline && (
                <div>
                  <span className="font-medium">Headline:</span> {block.content.headline}
                </div>
              )}
              {block.content?.title && (
                <div>
                  <span className="font-medium">Title:</span> {block.content.title}
                </div>
              )}
              {block.content?.description && (
                <div>
                  <span className="font-medium">Description:</span> 
                  <p className="mt-1">{block.content.description}</p>
                </div>
              )}
              {block.content?.ctaText && (
                <div>
                  <span className="font-medium">CTA:</span> {block.content.ctaText}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Prompt Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Wand2 className="w-4 h-4 mr-2" />
              AI Editor
            </CardTitle>
            <CardDescription>
              Describe how you want to improve this section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Make this more professional and add a customer testimonial quote'"
              rows={4}
              className="resize-none"
            />
            
            <Button
              onClick={() => handleSubmit(prompt)}
              disabled={!prompt.trim() || isSaving}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Applying Changes...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Apply AI Edit
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Suggestions */}
        {suggestions[block.type as keyof typeof suggestions] && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Suggestions</CardTitle>
              <CardDescription>
                Common improvements for {block.type} sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {suggestions[block.type as keyof typeof suggestions].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(suggestion)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span>{suggestion}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prompt History */}
        {promptHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Recent Edits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {promptHistory.map((historyPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(historyPrompt)}
                    className="w-full text-left p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
                  >
                    {historyPrompt}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PromptEditor;
