
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import sdk from '@/lib/sdk';
import { aiService } from '@/lib/ai';
import { 
  Eye, 
  Edit, 
  Save, 
  Globe, 
  Wand2, 
  Plus, 
  Settings,
  MessageSquare,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import WebsitePreview from '@/components/website/WebsitePreview';
import PromptEditor from '@/components/website/PromptEditor';
import BlockEditor from '@/components/website/BlockEditor';
import AIAssistant from '@/components/website/AIAssistant';

interface Website {
  id: string;
  userId: string;
  name: string;
  domain?: string;
  status: 'draft' | 'published' | 'archived';
  theme: any;
  businessInfo: any;
  seoConfig: any;
  createdAt: string;
  updatedAt: string;
}

interface Page {
  id: string;
  websiteId: string;
  title: string;
  slug: string;
  type: string;
  blocks: any[];
  seoMeta: any;
}

interface Block {
  id: string;
  pageId: string;
  type: string;
  content: any;
  order: number;
  aiGenerated: boolean;
  editable: boolean;
}

const WebsiteEditor: React.FC = () => {
  const { websiteId } = useParams<{ websiteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [website, setWebsite] = useState<Website | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadWebsiteData();
  }, [websiteId]);

  const loadWebsiteData = async () => {
    if (!websiteId || !user?.id) return;

    try {
      setIsLoading(true);
      
      // Load website
      const websiteData = await sdk.getItem<Website>('websites', websiteId);
      if (!websiteData || websiteData.userId !== user.id) {
        navigate('/');
        return;
      }
      setWebsite(websiteData);

      // Load pages
      const allPages = await sdk.get<Page>('pages');
      const websitePages = allPages.filter(p => p.websiteId === websiteId);
      setPages(websitePages);

      // Set current page (home page first)
      const homePage = websitePages.find(p => p.type === 'home') || websitePages[0];
      if (homePage) {
        setCurrentPage(homePage);
        await loadPageBlocks(homePage.id);
      }
    } catch (error: any) {
      console.error('Failed to load website data:', error);
      toast({
        title: "Loading failed",
        description: error.message || "Failed to load website data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPageBlocks = async (pageId: string) => {
    try {
      const allBlocks = await sdk.get<Block>('blocks');
      const pageBlocks = allBlocks
        .filter(b => b.pageId === pageId)
        .sort((a, b) => a.order - b.order);
      setBlocks(pageBlocks);
    } catch (error) {
      console.error('Failed to load page blocks:', error);
    }
  };

  const handleBlockEdit = async (blockId: string, prompt: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    try {
      setIsSaving(true);
      
      // Use AI to edit the content
      const currentContent = JSON.stringify(block.content);
      const editedContent = await aiService.editContent(currentContent, prompt);
      
      let newContent;
      try {
        newContent = JSON.parse(editedContent);
      } catch {
        // If not JSON, treat as plain text content
        newContent = { ...block.content, text: editedContent };
      }

      // Update block
      const updatedBlock = await sdk.update<Block>('blocks', blockId, {
        content: newContent,
        aiGenerated: true
      });

      // Update local state
      setBlocks(blocks.map(b => b.id === blockId ? updatedBlock : b));
      
      toast({
        title: "Content updated",
        description: "Your content has been updated with AI assistance.",
      });
    } catch (error: any) {
      console.error('Block edit error:', error);
      toast({
        title: "Edit failed",
        description: error.message || "Failed to edit content.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!website) return;

    try {
      setIsPublishing(true);
      
      await sdk.update('websites', website.id, {
        status: 'published',
        updatedAt: new Date().toISOString()
      });

      setWebsite({ ...website, status: 'published' });
      
      toast({
        title: "Website published!",
        description: "Your website is now live and accessible to visitors.",
      });
    } catch (error: any) {
      console.error('Publish error:', error);
      toast({
        title: "Publish failed",
        description: error.message || "Failed to publish website.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePageSwitch = async (page: Page) => {
    setCurrentPage(page);
    await loadPageBlocks(page.id);
    setSelectedBlock(null);
  };

  const handleBlockSelect = (block: Block) => {
    setSelectedBlock(block);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your website...</p>
        </div>
      </div>
    );
  }

  if (!website || !currentPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Website not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{website.name}</h1>
              <p className="text-sm text-gray-500">
                {website.domain || `${website.name.toLowerCase().replace(/\s+/g, '-')}.mybiz.app`}
              </p>
            </div>
            <Badge variant={website.status === 'published' ? 'default' : 'secondary'}>
              {website.status}
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowAIAssistant(true)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>

            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Pages</h3>
            <div className="space-y-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageSwitch(page)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    currentPage?.id === page.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>

          {/* Block List */}
          <div className="flex-1 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Page Sections</h3>
            <div className="space-y-2">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  onClick={() => handleBlockSelect(block)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedBlock?.id === block.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{block.type}</span>
                    {block.aiGenerated && (
                      <Sparkles className="w-3 h-3 text-purple-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {block.content?.title || block.content?.headline || `Section ${index + 1}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Preview/Editor Area */}
          <div className="flex-1 bg-gray-100">
            {previewMode ? (
              <WebsitePreview 
                website={website} 
                pages={pages} 
                currentPage={currentPage}
                blocks={blocks}
              />
            ) : (
              <BlockEditor
                blocks={blocks}
                selectedBlock={selectedBlock}
                onBlockSelect={handleBlockSelect}
                onBlockEdit={handleBlockEdit}
                isSaving={isSaving}
              />
            )}
          </div>

          {/* Right Panel */}
          {selectedBlock && !previewMode && (
            <div className="w-80 bg-white border-l border-gray-200">
              <PromptEditor
                block={selectedBlock}
                onEdit={handleBlockEdit}
                isSaving={isSaving}
              />
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant
          website={website}
          currentPage={currentPage}
          onClose={() => setShowAIAssistant(false)}
          onContentUpdate={loadWebsiteData}
        />
      )}
    </div>
  );
};

export default WebsiteEditor;
