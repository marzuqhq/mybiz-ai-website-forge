import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles, Wand2, ArrowRight, Plus, X } from 'lucide-react';
import sdk from '@/lib/sdk';
import { aiService } from '@/lib/ai-service';

const CreateWebsiteForm: React.FC = () => {
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
    pages: ['home', 'about', 'services', 'contact'] as string[]
  });
  const [newService, setNewService] = useState('');

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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

    if (!formData.businessName || !formData.businessType || formData.services.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      console.log('🚀 Starting website generation process...');

      // Generate unique slug
      const baseSlug = generateSlug(formData.businessName);
      const uniqueSlug = await sdk.generateUniqueSlug(baseSlug);
      console.log('📝 Generated unique slug:', uniqueSlug);

      // Generate website structure using AI
      console.log('🤖 Generating website structure with AI...');
      const aiResult = await aiService.generateWebsite(formData);
      console.log('✅ AI generation complete:', aiResult);

      // Create website record with all required fields
      console.log('💾 Creating website record...');
      const websiteData = {
        userId: user.id,
        name: formData.businessName,
        slug: uniqueSlug,
        publicUrl: `${window.location.origin}/${uniqueSlug}`,
        businessInfo: formData,
        theme: aiResult.theme || {
          primaryColor: '#6366F1',
          secondaryColor: '#8B5CF6',
          accentColor: '#FF6B6B',
          fontFamily: 'Inter',
          fontHeading: 'Inter',
          borderRadius: 'medium',
          spacing: 'comfortable',
        },
        seoConfig: aiResult.seoConfig || {
          metaTitle: `${formData.businessName} - Professional ${formData.businessType}`,
          metaDescription: `${formData.businessName} offers professional ${formData.businessType.toLowerCase()} services.`,
          keywords: [formData.businessType.toLowerCase(), ...formData.services.map(s => s.toLowerCase())],
          ogImage: '',
          sitemap: true,
          robotsTxt: 'index,follow',
        },
        status: 'draft'
      };

      const website = await sdk.insert('websites', websiteData);
      console.log('✅ Website created:', website.id);

      // Create pages with proper error handling and delays
      const pages = aiResult.pages || [
        {
          title: 'Home',
          slug: 'home',
          type: 'page',
          blocks: [
            {
              type: 'hero',
              content: {
                headline: `Welcome to ${formData.businessName}`,
                subheadline: `Professional ${formData.businessType} services`,
                ctaText: 'Get Started',
              }
            }
          ]
        }
      ];

      console.log('📄 Creating pages and blocks...');
      
      for (let i = 0; i < pages.length; i++) {
        const pageData = pages[i];
        console.log(`Creating page ${i + 1}/${pages.length}: ${pageData.title}`);
        
        try {
          // Add delay between operations to prevent conflicts
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          const pageSlug = pageData.slug || generateSlug(pageData.title);
          const page = await sdk.insert('pages', {
            websiteId: website.id,
            title: pageData.title,
            slug: pageSlug,
            type: pageData.type || 'page',
            seoMeta: {
              title: pageData.title,
              description: aiResult.seoConfig?.metaDescription || `${pageData.title} - ${formData.businessName}`,
              keywords: aiResult.seoConfig?.keywords || []
            }
          });

          console.log(`✅ Page created: ${page.title} (${page.id})`);

          // Create blocks for each page with delays
          if (pageData.blocks && pageData.blocks.length > 0) {
            for (let j = 0; j < pageData.blocks.length; j++) {
              const blockData = pageData.blocks[j];
              
              try {
                // Small delay between blocks
                if (j > 0) {
                  await new Promise(resolve => setTimeout(resolve, 500));
                }

                await sdk.insert('blocks', {
                  pageId: page.id,
                  type: blockData.type || 'content',
                  content: blockData.content || {},
                  order: j,
                  aiGenerated: true,
                  editable: true
                });

                console.log(`✅ Block ${j + 1} created for page ${page.title}`);
              } catch (blockError) {
                console.error(`Failed to create block ${j + 1} for page ${page.title}:`, blockError);
                // Continue with other blocks instead of failing completely
              }
            }
          }
        } catch (pageError) {
          console.error(`Failed to create page ${pageData.title}:`, pageError);
          // Continue with other pages instead of failing completely
        }
      }

      // Generate FAQs with error handling
      try {
        console.log('❓ Generating FAQs...');
        const faqs = await aiService.generateFAQs(formData);
        
        for (let i = 0; i < faqs.length; i++) {
          const faq = faqs[i];
          
          try {
            // Small delay between FAQ insertions
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }

            await sdk.insert('faqs', {
              websiteId: website.id,
              question: faq.question,
              answer: faq.answer,
              aiGenerated: true
            });
          } catch (faqError) {
            console.error(`Failed to create FAQ ${i + 1}:`, faqError);
          }
        }
        console.log('✅ FAQs generated successfully');
      } catch (faqError) {
        console.error('Failed to generate FAQs:', faqError);
      }

      toast({
        title: "Website generated!",
        description: "Your AI-powered website has been created successfully.",
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

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.businessName && formData.businessType;
      case 2:
        return formData.targetAudience && formData.location && formData.tone;
      case 3:
        return formData.services.length > 0;
      default:
        return false;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Creating Your Website</h2>
          <p className="text-slate-600 mb-6">Our AI is analyzing your business and generating a custom website...</p>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Analyzing business information</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
              <span className="text-sm text-slate-600">Generating pages and content</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
              <span className="text-sm text-slate-600">Creating SEO optimization</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-full px-4 py-2 mb-6 shadow-sm">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">AI Website Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Describe Your Business,
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Get Your Website</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our AI will create a complete, professional website tailored to your business in under 60 seconds.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                stepNum === step
                  ? 'bg-indigo-600 text-white'
                  : stepNum < step
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {stepNum < step ? '✓' : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-20 h-1 mx-2 ${
                  stepNum < step ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 1 && 'Tell us about your business'}
              {step === 2 && 'Who do you serve?'}
              {step === 3 && 'What services do you offer?'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Basic information about your business'}
              {step === 2 && 'Help us understand your target market'}
              {step === 3 && 'List your key services or products'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Enter your business name"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
                    placeholder="Briefly describe what your business does..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    placeholder="e.g., Small business owners, Families, Professionals"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location/Region *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., San Francisco, California, Online"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Brand Tone *</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {toneOptions.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => handleInputChange('tone', tone.value)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          formData.tone === tone.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-medium">{tone.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Services/Products *</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Add a service or product"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    />
                    <Button onClick={addService} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {formData.services.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Services:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service) => (
                        <Badge key={service} variant="secondary" className="px-3 py-1">
                          {service}
                          <button
                            onClick={() => removeService(service)}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-indigo-900">Ready to Generate!</h3>
                  </div>
                  <p className="text-indigo-700 text-sm">
                    Our AI will create a complete website with pages, content, and SEO optimization based on your information.
                  </p>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGenerate}
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Website
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateWebsiteForm;
