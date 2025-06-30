
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Users,
  BarChart3,
  Target,
  Mail,
  Phone,
  Globe,
  Shield,
  Zap,
  Briefcase,
  PieChart,
  Search,
  Filter,
  Star,
  Settings,
  Plus,
  Download,
  Upload,
  Share2,
  Code
} from 'lucide-react';

interface BusinessTool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  component: string;
  features: string[];
  isPremium: boolean;
}

const businessTools: BusinessTool[] = [
  // Financial Tools
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    category: 'Financial',
    description: 'Calculate return on investment for business decisions',
    icon: <TrendingUp className="w-6 h-6" />,
    component: 'ROICalculator',
    features: ['Real-time calculations', 'Multiple scenarios', 'Export results'],
    isPremium: false
  },
  {
    id: 'loan-calculator',
    name: 'Business Loan Calculator',
    category: 'Financial',
    description: 'Calculate loan payments and interest rates',
    icon: <DollarSign className="w-6 h-6" />,
    component: 'LoanCalculator',
    features: ['Monthly payments', 'Amortization schedule', 'Total interest'],
    isPremium: false
  },
  {
    id: 'break-even-analyzer',
    name: 'Break-Even Analyzer',
    category: 'Financial',
    description: 'Analyze break-even point for products and services',
    icon: <BarChart3 className="w-6 h-6" />,
    component: 'BreakEvenAnalyzer',
    features: ['Fixed/variable costs', 'Multiple products', 'Visual charts'],
    isPremium: true
  },
  {
    id: 'budget-planner',
    name: 'Budget Planner',
    category: 'Financial',
    description: 'Create and manage business budgets',
    icon: <PieChart className="w-6 h-6" />,
    component: 'BudgetPlanner',
    features: ['Category tracking', 'Variance analysis', 'Monthly/yearly views'],
    isPremium: false
  },
  {
    id: 'cash-flow-forecaster',
    name: 'Cash Flow Forecaster',
    category: 'Financial',
    description: 'Predict future cash flow patterns',
    icon: <TrendingUp className="w-6 h-6" />,
    component: 'CashFlowForecaster',
    features: ['12-month projection', 'Scenario modeling', 'Risk analysis'],
    isPremium: true
  },

  // Productivity Tools
  {
    id: 'time-tracker',
    name: 'Time Tracker',
    category: 'Productivity',
    description: 'Track time spent on projects and tasks',
    icon: <Clock className="w-6 h-6" />,
    component: 'TimeTracker',
    features: ['Project tracking', 'Reports', 'Team collaboration'],
    isPremium: false
  },
  {
    id: 'meeting-scheduler',
    name: 'Meeting Scheduler',
    category: 'Productivity',
    description: 'Schedule and manage meetings efficiently',
    icon: <Calendar className="w-6 h-6" />,
    component: 'MeetingScheduler',
    features: ['Calendar integration', 'Time zones', 'Automated reminders'],
    isPremium: false
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    category: 'Productivity',
    description: 'Organize and track project tasks',
    icon: <Target className="w-6 h-6" />,
    component: 'TaskManager',
    features: ['Kanban boards', 'Due dates', 'Team assignments'],
    isPremium: false
  },
  {
    id: 'document-generator',
    name: 'Document Generator',
    category: 'Productivity',
    description: 'Generate business documents from templates',
    icon: <FileText className="w-6 h-6" />,
    component: 'DocumentGenerator',
    features: ['Multiple templates', 'Custom fields', 'PDF export'],
    isPremium: true
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    category: 'Productivity',
    description: 'Generate secure passwords for business accounts',
    icon: <Shield className="w-6 h-6" />,
    component: 'PasswordGenerator',
    features: ['Customizable length', 'Character sets', 'Strength meter'],
    isPremium: false
  },

  // Marketing Tools
  {
    id: 'email-validator',
    name: 'Email Validator',
    category: 'Marketing',
    description: 'Validate email addresses for marketing campaigns',
    icon: <Mail className="w-6 h-6" />,
    component: 'EmailValidator',
    features: ['Bulk validation', 'Deliverability check', 'Export results'],
    isPremium: false
  },
  {
    id: 'hashtag-generator',
    name: 'Hashtag Generator',
    category: 'Marketing',
    description: 'Generate relevant hashtags for social media',
    icon: <Search className="w-6 h-6" />,
    component: 'HashtagGenerator',
    features: ['Trending hashtags', 'Industry-specific', 'Analytics'],
    isPremium: false
  },
  {
    id: 'social-media-scheduler',
    name: 'Social Media Scheduler',
    category: 'Marketing',
    description: 'Schedule posts across social media platforms',
    icon: <Share2 className="w-6 h-6" />,
    component: 'SocialMediaScheduler',
    features: ['Multi-platform', 'Best time suggestions', 'Analytics'],
    isPremium: true
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'Marketing',
    description: 'Generate QR codes for marketing materials',
    icon: <Code className="w-6 h-6" />,
    component: 'QRCodeGenerator',
    features: ['Custom designs', 'Analytics tracking', 'Bulk generation'],
    isPremium: false
  },
  {
    id: 'color-palette-generator',
    name: 'Brand Color Palette',
    category: 'Marketing',
    description: 'Generate color palettes for brand consistency',
    icon: <Zap className="w-6 h-6" />,
    component: 'ColorPaletteGenerator',
    features: ['Harmony rules', 'Export formats', 'Accessibility check'],
    isPremium: false
  },

  // Business Analytics
  {
    id: 'competitor-analyzer',
    name: 'Competitor Analyzer',
    category: 'Analytics',
    description: 'Analyze competitor websites and strategies',
    icon: <Globe className="w-6 h-6" />,
    component: 'CompetitorAnalyzer',
    features: ['SEO analysis', 'Social presence', 'Traffic estimates'],
    isPremium: true
  },
  {
    id: 'keyword-research',
    name: 'Keyword Research Tool',
    category: 'Analytics',
    description: 'Research keywords for SEO and content',
    icon: <Search className="w-6 h-6" />,
    component: 'KeywordResearcher',
    features: ['Search volume', 'Competition level', 'Related keywords'],
    isPremium: true
  },
  {
    id: 'conversion-optimizer',
    name: 'Conversion Rate Optimizer',
    category: 'Analytics',
    description: 'Optimize website conversion rates',
    icon: <Target className="w-6 h-6" />,
    component: 'ConversionOptimizer',
    features: ['A/B test suggestions', 'Heatmap analysis', 'User flow'],
    isPremium: true
  },
  {
    id: 'business-name-generator',
    name: 'Business Name Generator',
    category: 'Business',
    description: 'Generate creative business names',
    icon: <Briefcase className="w-6 h-6" />,
    component: 'BusinessNameGenerator',
    features: ['Domain availability', 'Trademark check', 'Logo suggestions'],
    isPremium: false
  },
  {
    id: 'swot-analyzer',
    name: 'SWOT Analysis Tool',
    category: 'Business',
    description: 'Conduct SWOT analysis for strategic planning',
    icon: <BarChart3 className="w-6 h-6" />,
    component: 'SWOTAnalyzer',
    features: ['Visual matrix', 'Export options', 'Team collaboration'],
    isPremium: false
  },

  // Communication Tools
  {
    id: 'email-signature-generator',
    name: 'Email Signature Generator',
    category: 'Communication',
    description: 'Create professional email signatures',
    icon: <Mail className="w-6 h-6" />,
    component: 'EmailSignatureGenerator',
    features: ['Multiple templates', 'Social links', 'Mobile-friendly'],
    isPremium: false
  },
  {
    id: 'invoice-generator',
    name: 'Quick Invoice Generator',
    category: 'Financial',
    description: 'Generate professional invoices quickly',
    icon: <FileText className="w-6 h-6" />,
    component: 'QuickInvoiceGenerator',
    features: ['Custom branding', 'Payment integration', 'Auto-numbering'],
    isPremium: false
  },
  {
    id: 'contract-templates',
    name: 'Contract Template Library',
    category: 'Legal',
    description: 'Access various business contract templates',
    icon: <FileText className="w-6 h-6" />,
    component: 'ContractTemplates',
    features: ['Multiple categories', 'Customizable fields', 'Legal compliance'],
    isPremium: true
  },
  {
    id: 'team-organizer',
    name: 'Team Organizer',
    category: 'HR',
    description: 'Organize team information and roles',
    icon: <Users className="w-6 h-6" />,
    component: 'TeamOrganizer',
    features: ['Org charts', 'Contact management', 'Role definitions'],
    isPremium: false
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    category: 'Financial',
    description: 'Track and categorize business expenses',
    icon: <DollarSign className="w-6 h-6" />,
    component: 'ExpenseTracker',
    features: ['Receipt upload', 'Category tracking', 'Tax preparation'],
    isPremium: false
  }
];

const BusinessToolsCenter: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTools, setFilteredTools] = useState(businessTools);
  const [selectedTool, setSelectedTool] = useState<BusinessTool | null>(null);

  const categories = ['All', ...new Set(businessTools.map(tool => tool.category))];

  useEffect(() => {
    let filtered = businessTools;

    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory]);

  const handleToolSelect = (tool: BusinessTool) => {
    setSelectedTool(tool);
    toast({
      title: "Tool Selected",
      description: `${tool.name} is now ready to use.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Tools Center</h1>
        <p className="text-gray-600">25+ powerful tools to supercharge your business operations</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => handleToolSelect(tool)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold line-clamp-1">
                      {tool.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
                {tool.isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {tool.description}
              </p>
              <div className="space-y-1">
                {tool.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
                {tool.features.length > 2 && (
                  <div className="text-xs text-blue-600 font-medium">
                    +{tool.features.length - 2} more features
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No tools found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters.</p>
        </div>
      )}

      {/* Selected Tool Modal/Details */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {selectedTool.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedTool.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {selectedTool.category}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedTool(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{selectedTool.description}</p>
              
              <h4 className="font-semibold mb-3">Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {selectedTool.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => {
                  toast({
                    title: "Tool Launched",
                    description: `${selectedTool.name} is now ready to use.`,
                  });
                  setSelectedTool(null);
                }}>
                  Launch Tool
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {selectedTool.isPremium && (
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Premium Tool</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    This tool requires a premium subscription for full access to all features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessToolsCenter;
