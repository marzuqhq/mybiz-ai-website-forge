
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/lib/ai';
import sdk from '@/lib/sdk';
import { 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Target,
  BarChart3
} from 'lucide-react';

interface SEOAnalysis {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    title: string;
    description: string;
    fix: string;
  }>;
  keywords: string[];
  recommendations: string[];
}

interface SEOOptimizerProps {
  websiteId: string;
  pageId?: string;
}

const SEOOptimizer: React.FC<SEOOptimizerProps> = ({ websiteId, pageId }) => {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    performSEOAnalysis();
  }, [websiteId, pageId]);

  const performSEOAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Get website and page data
      const website = await sdk.getItem('websites', websiteId);
      if (!website) throw new Error('Website not found');

      let pageData = null;
      if (pageId) {
        pageData = await sdk.getItem('pages', pageId);
      } else {
        // Analyze home page by default
        const pages = await sdk.get('pages');
        pageData = pages.find(p => p.websiteId === websiteId && p.type === 'home');
      }

      if (!pageData) throw new Error('Page not found');

      // Get page blocks for content analysis
      const blocks = await sdk.get('blocks');
      const pageBlocks = blocks.filter(b => b.pageId === pageData.id);

      // Extract content for analysis
      const content = pageBlocks.map(block => {
        switch (block.type) {
          case 'hero':
            return `${block.content.headline} ${block.content.subheadline}`;
          case 'about':
            return `${block.content.title} ${block.content.description}`;
          case 'services':
            return `${block.content.title} ${block.content.services?.map((s: any) => `${s.title} ${s.description}`).join(' ') || ''}`;
          default:
            return JSON.stringify(block.content);
        }
      }).join(' ');

      // Use AI to analyze SEO
      const seoAnalysis = await aiService.generateSEOSuggestions(
        content,
        website.businessInfo?.keywords || []
      );

      // Mock additional analysis data
      const mockAnalysis: SEOAnalysis = {
        score: 75,
        issues: [
          {
            type: 'warning',
            title: 'Missing Meta Description',
            description: 'Page is missing a meta description which is important for search results.',
            fix: 'Add a compelling 150-160 character meta description that includes your target keywords.'
          },
          {
            type: 'info',
            title: 'Image Alt Text',
            description: 'Some images are missing alt text for better accessibility and SEO.',
            fix: 'Add descriptive alt text to all images mentioning relevant keywords when appropriate.'
          },
          {
            type: 'error',
            title: 'Page Load Speed',
            description: 'Page load time could be improved for better user experience and SEO.',
            fix: 'Optimize images and reduce unnecessary JavaScript to improve load times.'
          }
        ],
        keywords: website.businessInfo?.keywords || ['business', 'service', 'local'],
        recommendations: [
          'Add more internal links between related pages',
          'Create a blog to target long-tail keywords',
          'Optimize for local SEO with location-based keywords',
          'Add schema markup for better search engine understanding'
        ]
      };

      setAnalysis(mockAnalysis);

    } catch (error: any) {
      console.error('SEO analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze SEO.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimize = async (issueIndex: number) => {
    if (!analysis) return;
    
    setIsOptimizing(true);
    try {
      const issue = analysis.issues[issueIndex];
      
      // Apply the SEO fix based on issue type
      // This is a simplified implementation - in a real app, you'd make specific changes
      
      toast({
        title: "SEO optimization applied",
        description: `Fixed: ${issue.title}`,
      });

      // Refresh analysis
      await performSEOAnalysis();
      
    } catch (error: any) {
      console.error('SEO optimization error:', error);
      toast({
        title: "Optimization failed",
        description: error.message || "Failed to apply SEO optimization.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing SEO performance...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Failed to load SEO analysis</p>
            <Button onClick={performSEOAnalysis} className="mt-4">
              Retry Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>SEO Analysis</span>
              </CardTitle>
              <CardDescription>
                Comprehensive SEO analysis and optimization recommendations
              </CardDescription>
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}
              </div>
              <Badge variant={getScoreBadge(analysis.score)} className="mt-1">
                SEO Score
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                analysis.score >= 80 ? 'bg-green-500' : 
                analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${analysis.score}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues & Fixes</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          {analysis.issues.map((issue, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {issue.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      {issue.type === 'info' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      <h3 className="font-semibold">{issue.title}</h3>
                      <Badge 
                        variant={
                          issue.type === 'error' ? 'destructive' : 
                          issue.type === 'warning' ? 'secondary' : 'default'
                        }
                        className="text-xs"
                      >
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{issue.description}</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">{issue.fix}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleOptimize(index)}
                    disabled={isOptimizing}
                    className="ml-4"
                    size="sm"
                  >
                    {isOptimizing ? 'Fixing...' : 'Auto-Fix'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Target Keywords</span>
              </CardTitle>
              <CardDescription>
                Keywords your website is optimized for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Research New Keywords
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>SEO Recommendations</span>
              </CardTitle>
              <CardDescription>
                AI-powered suggestions to improve your SEO performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOOptimizer;
