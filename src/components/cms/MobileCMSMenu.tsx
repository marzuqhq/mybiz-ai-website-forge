
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  HelpCircle, 
  Package, 
  Users, 
  Mail, 
  DollarSign, 
  FormInput, 
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Settings,
  BarChart3,
  Zap,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface CMSModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
  isNew?: boolean;
  component: string;
}

interface MobileCMSMenuProps {
  onModuleSelect: (moduleId: string) => void;
  activeModule: string;
  modules?: CMSModule[];
}

const defaultModules: CMSModule[] = [
  {
    id: 'blog',
    name: 'Blog Manager',
    description: 'Create and manage blog posts',
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-blue-500',
    count: 12,
    component: 'BlogManager'
  },
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'Manage your products and inventory',
    icon: <Package className="w-6 h-6" />,
    color: 'bg-green-500',
    count: 8,
    component: 'ProductManager'
  },
  {
    id: 'crm',
    name: 'Customer Relations',
    description: 'Manage customers and leads',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-purple-500',
    count: 45,
    component: 'CRMManager'
  },
  {
    id: 'email',
    name: 'Email Marketing',
    description: 'Create and send email campaigns',
    icon: <Mail className="w-6 h-6" />,
    color: 'bg-orange-500',
    count: 3,
    isNew: true,
    component: 'EmailMarketingManager'
  },
  {
    id: 'invoices',
    name: 'Invoice Management',
    description: 'Create and track invoices',
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-emerald-500',
    count: 7,
    component: 'InvoiceManager'
  },
  {
    id: 'forms',
    name: 'Form Builder',
    description: 'Build custom forms and surveys',
    icon: <FormInput className="w-6 h-6" />,
    color: 'bg-pink-500',
    count: 4,
    component: 'FormBuilderManager'
  },
  {
    id: 'faqs',
    name: 'FAQ Manager',
    description: 'Manage frequently asked questions',
    icon: <HelpCircle className="w-6 h-6" />,
    color: 'bg-yellow-500',
    count: 15,
    component: 'FAQManager'
  },
  {
    id: 'analytics',
    name: 'Analytics & Reports',
    description: 'View performance metrics',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'bg-indigo-500',
    isNew: true,
    component: 'AnalyticsManager'
  }
];

const MobileCMSMenu: React.FC<MobileCMSMenuProps> = ({
  onModuleSelect,
  activeModule,
  modules = defaultModules
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filteredModules, setFilteredModules] = useState(modules);

  React.useEffect(() => {
    const filtered = modules.filter(module =>
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModules(filtered);
  }, [searchTerm, modules]);

  const handleModuleClick = (moduleId: string) => {
    onModuleSelect(moduleId);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="h-12 w-12 rounded-full bg-white shadow-lg border"
          variant="outline"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* CMS Menu */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">CMS Dashboard</h2>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Content</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {modules.reduce((acc, mod) => acc + (mod.count || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Content Modules
            </h3>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredModules.map((module) => (
                  <Card 
                    key={module.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      activeModule === module.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-white mx-auto`}>
                          {module.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                            {module.name}
                          </h4>
                          {module.count !== undefined && (
                            <p className="text-xs text-gray-500">{module.count} items</p>
                          )}
                        </div>
                        {module.isNew && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredModules.map((module) => (
                  <Card 
                    key={module.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      activeModule === module.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                          {module.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {module.name}
                            </h4>
                            {module.isNew && (
                              <Badge className="bg-green-100 text-green-800 text-xs ml-2">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {module.description}
                          </p>
                          {module.count !== undefined && (
                            <p className="text-xs text-gray-400 mt-1">
                              {module.count} items
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create New Content
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                CMS Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileCMSMenu;
