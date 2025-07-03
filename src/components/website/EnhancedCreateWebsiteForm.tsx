
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  ArrowRight, 
  Plus, 
  X, 
  Upload, 
  Palette, 
  Type, 
  Layout,
  FileText,
  Check
} from 'lucide-react';
import sdk from '@/lib/sdk';
import { aiService } from '@/lib/ai-service';

const EnhancedCreateWebsiteForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    targetAudience: '',
    location: '',
    tone: '',
    services: [] as string[],
    description: '',
    branding: {
      logo: '',
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
      fontFamily: 'Inter',
      layout: 'modern'
    },
    pages: ['Home', 'About', 'Services', 'Contact'] as string[]
  });
  const [newService, setNewService] = useState('');
  const [newPage, setNewPage] = useState('');

  const businessTypes = [
    'Restaurant', 'Retail Store', 'Professional Services', 'Healthcare', 'Beauty & Wellness',
    'Real Estate', 'Consulting', 'Technology', 'Education', 'Non-Profit', 'E-commerce', 'Other'
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional & Trustworthy' },
    { value: 'friendly', label: 'Friendly & Approachable' },
    { value: 'modern', label: 'Modern & Innovative' },
    { value: 'elegant', label: 'Elegant & Sophisticated' },
    { value: 'playful', label: 'Playful & Creative' }
  ];

  const fontOptions = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Roboto', label: 'Roboto (Clean)' },
    { value: 'Playfair Display', label: 'Playfair (Elegant)' },
    { value: 'Montserrat', label: 'Montserrat (Bold)' },
    { value: 'Open Sans', label: 'Open Sans (Friendly)' }
  ];

  const layoutOptions = [
    { value: 'modern', label: 'Modern Grid' },
    { value: 'classic', label: 'Classic Layout' },
    { value: 'minimal', label: 'Minimal Design' },
    { value: 'creative', label: 'Creative Layout' }
  ];

  const commonPages = [
    'Home', 'About', 'Services', 'Contact', 'Blog', 'Portfolio', 
    'Testimonials', 'FAQ', 'Team', 'Pricing', 'Gallery', 'Privacy Policy'
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const addPage = () => {
    if (newPage.trim() && !formData.pages.includes(newPage.trim())) {
      setFormData(prev => ({
        ...prev,
        pages: [...prev.pages, newPage.trim()]
      }));
      setNewPage('');
    }
  };

  const removePage = (page: string) => {
    if (formData.pages.length > 1) {
      setFormData(prev => ({
        ...prev,
        pages: prev.pages.filter(p => p !== page)
      }));
    }
  };

  const addCommonPage = (page: string) => {
    if (!formData.pages.includes(page)) {
      setFormData(prev => ({
        ...prev,
        pages: [...prev.pages, page]
      }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('branding.logo', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleGenerate = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a website.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.businessName || !formData.businessType) {
      toast({
        title: "Missing information",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      console.log('🚀 Starting enhanced website generation...');

      // Generate unique slug
      const baseSlug = generateSlug(formData.businessName);
      const uniqueSlug = await sdk.generateUniqueSlug(baseSlug);

      // Generate website with enhanced AI
      const aiResult = await aiService.generateWebsite(formData);

      // Create website record
      const websiteData = {
        userId: user.id,
        name: formData.businessName,
        slug: uniqueSlug,
        publicUrl: `${window.location.origin}/${uniqueSlug}`,
        businessInfo: formData,
        theme: aiResult.theme,
        seoConfig: aiResult.seoConfig,
        status: 'draft'
      };

      const website = await sdk.insert('websites', websiteData);
      console.log('✅ Website created:', website.id);

      // Create pages with HTML/CSS/JS content
      for (const pageData of aiResult.pages) {
        const page = await sdk.insert('pages', {
          websiteId: website.id,
          title: pageData.title,
          slug: pageData.slug,
          type: pageData.type,
          htmlContent: pageData.htmlContent,
          cssContent: pageData.cssContent,
          jsContent: pageData.jsContent,
          seoMeta: pageData.seoMeta
        });

        // Add small delay between page creations
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Generate FAQs
      const faqs = await aiService.generateFAQs(formData);
      for (const faq of faqs) {
        await sdk.insert('faqs', {
          websiteId: website.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category || 'general',
          aiGenerated: true
        });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast({
        title: "Website generated successfully!",
        description: "Your AI-powered website is ready for customization.",
      });

      navigate(`/website/${website.id}`);
    } catch (error: any) {
      console.error('Website generation error:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate website. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Information</h2>
        <p className="text-gray-600">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            placeholder="Your Business Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type *</Label>
          <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input
            id="targetAudience"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="Who are your customers?"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, State or Region"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Brand Tone</Label>
        <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select brand tone" />
          </SelectTrigger>
          <SelectContent>
            {toneOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your business, mission, and what makes you unique..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Services & Branding</h2>
        <p className="text-gray-600">Define your services and brand identity</p>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="space-y-2">
            <Label>Services/Products *</Label>
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add a service or product"
                onKeyPress={(e) => e.key === 'Enter' && addService()}
              />
              <Button type="button" onClick={addService} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.services.map((service) => (
              <Badge key={service} variant="secondary" className="px-3 py-1">
                {service}
                <button
                  onClick={() => removeService(service)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Logo (Optional)</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-gray-400">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </div>
                </Label>
                {formData.branding.logo && (
                  <img src={formData.branding.logo} alt="Logo" className="w-12 h-12 object-contain" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.branding.primaryColor}
                    onChange={(e) => handleInputChange('branding.primaryColor', e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={formData.branding.primaryColor}
                    onChange={(e) => handleInputChange('branding.primaryColor', e.target.value)}
                    placeholder="#6366F1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={formData.branding.secondaryColor}
                    onChange={(e) => handleInputChange('branding.secondaryColor', e.target.value)}
                    className="w-12 h-10"
                  />
                  <Input
                    value={formData.branding.secondaryColor}
                    onChange={(e) => handleInputChange('branding.secondaryColor', e.target.value)}
                    placeholder="#8B5CF6"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select value={formData.branding.fontFamily} onValueChange={(value) => handleInputChange('branding.fontFamily', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Layout Style</Label>
                <Select value={formData.branding.layout} onValueChange={(value) => handleInputChange('branding.layout', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutOptions.map(layout => (
                      <SelectItem key={layout.value} value={layout.value}>{layout.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Website Pages</h2>
        <p className="text-gray-600">Choose which pages to include in your website</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Custom Pages</Label>
          <div className="flex gap-2">
            <Input
              value={newPage}
              onChange={(e) => setNewPage(e.target.value)}
              placeholder="Add a custom page"
              onKeyPress={(e) => e.key === 'Enter' && addPage()}
            />
            <Button type="button" onClick={addPage} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Common Pages</Label>
          <div className="grid grid-cols-3 gap-2">
            {commonPages.map((page) => (
              <Button
                key={page}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addCommonPage(page)}
                disabled={formData.pages.includes(page)}
                className="justify-start"
              >
                {formData.pages.includes(page) && <Check className="w-3 h-3 mr-1" />}
                {page}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Selected Pages ({formData.pages.length})</Label>
          <div className="flex flex-wrap gap-2">
            {formData.pages.map((page) => (
              <Badge key={page} variant="default" className="px-3 py-1">
                {page}
                {formData.pages.length > 1 && (
                  <button
                    onClick={() => removePage(page)}
                    className="ml-2 text-white/70 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating Your Website
            </h3>
            <p className="text-gray-600 mb-4">
              Our AI is creating your professional website with modern HTML, CSS, and JavaScript...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✨ Designing custom layouts</p>
              <p>🎨 Applying your brand colors</p>
              <p>📝 Writing optimized content</p>
              <p>📱 Ensuring mobile responsiveness</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your AI-Powered Website
          </h1>
          <p className="text-gray-600">
            Build a professional, fully functional website in minutes
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-12 h-px ${
                      step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                Back
              </Button>

              <div className="flex gap-2">
                {step < 3 && (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && (!formData.businessName || !formData.businessType)) ||
                      (step === 2 && formData.services.length === 0)
                    }
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}

                {step === 3 && (
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || formData.pages.length === 0}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Website
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedCreateWebsiteForm;
