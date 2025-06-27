
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wand2, ArrowRight, Building2, Users, Palette, Target } from 'lucide-react';
import { aiService } from '@/lib/ai';
import sdk from '@/lib/sdk';
import { useToast } from '@/hooks/use-toast';

const CreateWebsiteForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessDescription: '',
    targetAudience: '',
    location: '',
    tone: 'professional',
    services: '',
    goals: '',
  });

  const businessTypes = [
    'Restaurant & Food Service',
    'Retail Store',
    'Professional Services',
    'Healthcare & Medical',
    'Beauty & Wellness',
    'Fitness & Sports',
    'Real Estate',
    'Education & Training',
    'Technology & Software',
    'Consulting',
    'E-commerce',
    'Non-profit',
    'Other'
  ];

  const tones = [
    { value: 'professional', label: 'Professional & Formal' },
    { value: 'friendly', label: 'Friendly & Approachable' },
    { value: 'modern', label: 'Modern & Trendy' },
    { value: 'elegant', label: 'Elegant & Sophisticated' },
    { value: 'playful', label: 'Playful & Fun' },
    { value: 'authoritative', label: 'Authoritative & Expert' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleGenerate = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a website.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate website content using AI
      const websiteContent = await aiService.generateWebsiteContent(
        formData.businessDescription,
        formData.businessType,
        formData.targetAudience,
        formData.tone
      );

      // Create website record
      const website = await sdk.insert('websites', {
        userId: user.id,
        name: formData.businessName,
        status: 'draft',
        theme: websiteContent.theme,
        businessInfo: {
          name: formData.businessName,
          type: formData.businessType,
          description: formData.businessDescription,
          targetAudience: formData.targetAudience,
          location: formData.location,
          tone: formData.tone,
          services: formData.services,
          goals: formData.goals,
        },
        seoConfig: {
          siteName: websiteContent.siteName,
          tagline: websiteContent.tagline,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create pages and blocks
      for (const pageData of websiteContent.pages) {
        const page = await sdk.insert('pages', {
          websiteId: website.id,
          title: pageData.title,
          slug: pageData.slug,
          type: pageData.type,
          seoMeta: pageData.seoMeta,
        });

        // Create blocks for this page
        for (let i = 0; i < pageData.blocks.length; i++) {
          const blockData = pageData.blocks[i];
          await sdk.insert('blocks', {
            pageId: page.id,
            type: blockData.type,
            content: blockData.content,
            order: i,
            aiGenerated: true,
            editable: true,
          });
        }
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

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.businessName && formData.businessType && formData.businessDescription;
      case 2:
        return formData.targetAudience;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Website</h1>
          <p className="text-gray-600">Tell us about your business and we'll create your perfect website with AI</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((number) => (
            <React.Fragment key={number}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {number}
              </div>
              {number < 3 && (
                <div className={`w-12 h-1 ${
                  step > number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {step === 1 && <><Building2 className="w-5 h-5 mr-2" /> Business Information</>}
              {step === 2 && <><Users className="w-5 h-5 mr-2" /> Target Audience</>}
              {step === 3 && <><Palette className="w-5 h-5 mr-2" /> Style & Preferences</>}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your business"}
              {step === 2 && "Who are your ideal customers?"}
              {step === 3 && "Choose your website's tone and style"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Business Information */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
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
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description *</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Describe what your business does, your unique value proposition, and what makes you special..."
                    value={formData.businessDescription}
                    onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Province, Country"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Step 2: Target Audience */}
            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="Describe your ideal customers: demographics, interests, pain points, needs..."
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="services">Key Services/Products (Optional)</Label>
                  <Textarea
                    id="services"
                    placeholder="List your main services or products..."
                    value={formData.services}
                    onChange={(e) => handleInputChange('services', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals">Website Goals (Optional)</Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you want your website to achieve? (e.g., generate leads, showcase portfolio, sell products...)"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Step 3: Style & Preferences */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="tone">Website Tone & Style</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Preview: Your Website Will Include</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Professional homepage with compelling hero section</li>
                    <li>• About page telling your business story</li>
                    <li>• Services/Products showcase</li>
                    <li>• Contact page with forms</li>
                    <li>• Blog section for content marketing</li>
                    <li>• FAQ section with relevant questions</li>
                    <li>• SEO optimization for better search visibility</li>
                    <li>• Mobile-responsive design</li>
                  </ul>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={step === 1}
              >
                Back
              </Button>

              {step < 3 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !isStepValid()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Website...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate My Website
                    </>
                  )}
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
