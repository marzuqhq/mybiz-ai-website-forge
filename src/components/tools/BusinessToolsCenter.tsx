import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Star,
  Download,
  Share2,
  Code
} from 'lucide-react';

// Import functional tools
import ROICalculator from './functional/ROICalculator';
import LoanCalculator from './functional/LoanCalculator';
import TimeTracker from './functional/TimeTracker';
import PasswordGenerator from './functional/PasswordGenerator';

interface BusinessTool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType;
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
    component: ROICalculator,
    features: ['Real-time calculations', 'Multiple scenarios', 'Export results'],
    isPremium: false
  },
  {
    id: 'loan-calculator',
    name: 'Business Loan Calculator',
    category: 'Financial',
    description: 'Calculate loan payments and interest rates',
    icon: <DollarSign className="w-6 h-6" />,
    component: LoanCalculator,
    features: ['Monthly payments', 'Amortization schedule', 'Total interest'],
    isPremium: false
  },
  
  // Productivity Tools
  {
    id: 'time-tracker',
    name: 'Time Tracker',
    category: 'Productivity',
    description: 'Track time spent on projects and tasks',
    icon: <Clock className="w-6 h-6" />,
    component: TimeTracker,
    features: ['Project tracking', 'Reports', 'Export timesheet'],
    isPremium: false
  },
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    category: 'Security',
    description: 'Generate secure passwords for business accounts',
    icon: <Shield className="w-6 h-6" />,
    component: PasswordGenerator,
    features: ['Customizable length', 'Character sets', 'Strength meter'],
    isPremium: false
  }
];

const BusinessToolsCenter: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredTools, setFilteredTools] = useState(businessTools);
  const [selectedTool, setSelectedTool] = useState<BusinessTool | null>(null);
  const [showTool, setShowTool] = useState(false);

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
    setShowTool(true);
    toast({
      title: "Tool Loaded",
      description: `${tool.name} is now ready to use.`,
    });
  };

  if (showTool && selectedTool) {
    const ToolComponent = selectedTool.component;
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            onClick={() => setShowTool(false)} 
            variant="outline"
            className="mb-4"
          >
            ← Back to Tools
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTool.name}</h1>
          <p className="text-gray-600">{selectedTool.description}</p>
        </div>
        <ToolComponent />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Tools Center</h1>
        <p className="text-gray-600">{businessTools.length}+ powerful tools to supercharge your business operations</p>
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
    </div>
  );
};

export default BusinessToolsCenter;
