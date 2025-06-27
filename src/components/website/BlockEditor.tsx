
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Edit, Move, Copy, Trash2 } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  content: any;
  order: number;
  aiGenerated: boolean;
}

interface BlockEditorProps {
  blocks: Block[];
  selectedBlock: Block | null;
  onBlockSelect: (block: Block) => void;
  onBlockEdit: (blockId: string, prompt: string) => Promise<void>;
  isSaving: boolean;
}

const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks,
  selectedBlock,
  onBlockSelect,
  onBlockEdit,
  isSaving
}) => {
  const renderBlockContent = (block: Block) => {
    const { type, content } = block;

    switch (type) {
      case 'hero':
        return (
          <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white rounded-lg">
            <h1 className="text-3xl font-bold mb-4">{content.headline}</h1>
            <p className="text-lg mb-6 text-blue-100">{content.subheadline}</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold">
              {content.ctaText}
            </button>
          </div>
        );

      case 'about':
        return (
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{content.title}</h2>
            <p className="text-gray-600">{content.description}</p>
          </div>
        );

      case 'services':
        return (
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.services?.slice(0, 4).map((service: any, index: number) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
            <p className="text-lg mb-6 text-blue-100">{content.description}</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold">
              {content.ctaText}
            </button>
          </div>
        );

      case 'contact':
        return (
          <div className="p-6 bg-white rounded-lg border">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {content.title || 'Contact Us'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {content.phone && <p><strong>Phone:</strong> {content.phone}</p>}
                {content.email && <p><strong>Email:</strong> {content.email}</p>}
                {content.address && <p><strong>Address:</strong> {content.address}</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Contact Form Preview</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="text-lg font-semibold mb-2 capitalize">{type} Section</h3>
            <pre className="text-sm text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const getBlockToolbar = (block: Block) => (
    <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {block.aiGenerated && (
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Sparkles className="w-3 h-3 mr-1" />
          AI
        </Badge>
      )}
      <div className="flex items-center space-x-1 bg-white shadow-lg rounded-lg p-1">
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
          <Move className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
          <Copy className="w-3 h-3" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 w-7 p-0"
          onClick={() => onBlockSelect(block)}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600 hover:text-red-700">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`relative group cursor-pointer transition-all ${
              selectedBlock?.id === block.id
                ? 'ring-2 ring-blue-500 ring-offset-2'
                : 'hover:shadow-lg'
            }`}
            onClick={() => onBlockSelect(block)}
          >
            {renderBlockContent(block)}
            {getBlockToolbar(block)}
          </div>
        ))}

        {blocks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-600">
              This page doesn't have any content blocks yet. Use the AI assistant to generate content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockEditor;
