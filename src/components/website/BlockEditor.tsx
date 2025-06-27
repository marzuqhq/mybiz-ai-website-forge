
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Move, Sparkles, Eye } from 'lucide-react';

interface Block {
  id: string;
  pageId: string;
  type: string;
  content: any;
  order: number;
  aiGenerated: boolean;
  editable: boolean;
}

interface BlockEditorProps {
  blocks: Block[];
  selectedBlock: Block | null;
  onBlockSelect: (block: Block) => void;
  onBlockEdit: (blockId: string, prompt: string) => void;
  isSaving: boolean;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks,
  selectedBlock,
  onBlockSelect,
  onBlockEdit,
  isSaving
}) => {
  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
            <h1 className="text-3xl font-bold mb-4">
              {block.content.headline || 'Hero Headline'}
            </h1>
            <p className="text-lg opacity-90 mb-6">
              {block.content.subheadline || 'Hero subheadline text goes here'}
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded font-semibold">
              {block.content.cta || 'Call to Action'}
            </button>
          </div>
        );

      case 'services':
        return (
          <div className="bg-white p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {block.content.title || 'Services'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(block.content.services || []).slice(0, 4).map((service: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              {block.content.title || 'About Us'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {block.content.content || 'About section content goes here...'}
            </p>
          </div>
        );

      case 'contact':
        return (
          <div className="bg-white p-8 rounded-lg border">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {block.content.title || 'Contact Us'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {block.content.email && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Email:</span>
                    <span className="text-blue-600">{block.content.email}</span>
                  </div>
                )}
                {block.content.phone && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Phone:</span>
                    <span>{block.content.phone}</span>
                  </div>
                )}
                {block.content.address && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Address:</span>
                    <span>{block.content.address}</span>
                  </div>
                )}
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Contact Form</div>
              </div>
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              {block.content.title || 'Call to Action'}
            </h2>
            <p className="text-lg opacity-90 mb-6">
              {block.content.description || 'CTA description goes here'}
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded font-semibold">
              {block.content.buttonText || 'Get Started'}
            </button>
          </div>
        );

      default:
        return (
          <div className="bg-white p-8 rounded-lg border border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">
              {block.type} Block
            </h3>
            <p className="text-gray-600">Content for {block.type} section</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-100 overflow-y-auto">
      <div className="p-6 space-y-6">
        {blocks.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content blocks</h3>
            <p className="text-gray-600">This page doesn't have any content blocks yet.</p>
          </div>
        ) : (
          blocks.map((block) => (
            <Card 
              key={block.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedBlock?.id === block.id
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onBlockSelect(block)}
            >
              <CardContent className="p-0">
                {/* Block Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Move className="w-4 h-4 text-gray-400 cursor-grab" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium capitalize text-gray-900">
                          {block.type.replace('-', ' ')} Block
                        </span>
                        {block.aiGenerated && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Order: {block.order} • {block.editable ? 'Editable' : 'Read-only'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {selectedBlock?.id === block.id && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={isSaving}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        {isSaving ? 'Saving...' : 'Edit with AI'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Block Preview */}
                <div className="p-4">
                  {renderBlockPreview(block)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlockEditor;
