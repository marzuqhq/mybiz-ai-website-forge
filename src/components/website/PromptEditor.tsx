
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wand2, Sparkles, ArrowRight, RotateCcw, Copy } from 'lucide-react';

interface Block {
  id: string;
  pageId: string;
  type: string;
  content: any;
  order: number;
  aiGenerated: boolean;
  editable: boolean;
}

interface PromptEditorProps {
  block: Block;
  onEdit: (blockId: string, prompt: string) => void;
  isSaving: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  block,
  onEdit,
  isSaving
}) => {
  const [prompt, setPrompt] = useState('');
  const [suggestions] = useState([
    'Make this more professional',
    'Add more personality',
    'Simplify the language',
    'Make it more engaging',
    'Add a call to action',
    'Improve the headline'
  ]);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onEdit(block.id, prompt.trim());
      setPrompt('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const getBlockTypeDescription = (type: string) => {
    switch (type) {
      case 'hero':
        return 'The main header section with headline, subheadline, and call-to-action button.';
      case 'services':
        return 'A section showcasing your services or offerings with descriptions.';
      case 'about':
        return 'Information about your business, mission, and values.';
      case 'contact':
        return 'Contact information and form for visitors to reach you.';
      case 'cta':
        return 'A call-to-action section to encourage visitor engagement.';
      case 'services-detail':
        return 'Detailed information about your services with features and benefits.';
      default:
        return 'Content section for your website.';
    }
  };

  const getBlockSpecificSuggestions = (type: string) => {
    switch (type) {
      case 'hero':
        return [
          'Make the headline more compelling',
          'Add urgency to the call-to-action',
          'Make it sound more professional',
          'Add benefits in the subheadline'
        ];
      case 'services':
        return [
          'Add pricing information',
          'Make the descriptions more detailed',
          'Add customer benefits',
          'Include process steps'
        ];
      case 'about':
        return [
          'Add company history',
          'Include team information',
          'Add mission statement',
          'Make it more personal'
        ];
      case 'contact':
        return [
          'Add business hours',
          'Include social media links',
          'Add directions or map',
          'Include emergency contact'
        ];
      default:
        return suggestions;
    }
  };

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Wand2 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Editor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="capitalize">
            {block.type.replace('-', ' ')}
          </Badge>
          {block.aiGenerated && (
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Generated
            </Badge>
          )}
        </div>
      </div>

      {/* Block Info */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-2 capitalize">
          {block.type.replace('-', ' ')} Section
        </h4>
        <p className="text-sm text-gray-600">
          {getBlockTypeDescription(block.type)}
        </p>
      </div>

      {/* Prompt Input */}
      <div className="p-6 border-b border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              How would you like to edit this section?
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to change this section..."
              rows={4}
              className="resize-none"
            />
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isSaving}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h4 className="font-medium text-gray-900 mb-4">Quick Suggestions</h4>
        <div className="space-y-2">
          {getBlockSpecificSuggestions(block.type).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
            >
              <div className="flex items-center justify-between">
                <span>{suggestion}</span>
                <ArrowRight className="w-3 h-3 opacity-50" />
              </div>
            </button>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-900">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Be specific about what you want to change</li>
              <li>• Mention tone (professional, casual, friendly)</li>
              <li>• Include specific details you want added</li>
              <li>• Ask for improvements to readability or engagement</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="flex-1">
            <RotateCcw className="w-3 h-3 mr-1" />
            Undo
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;
