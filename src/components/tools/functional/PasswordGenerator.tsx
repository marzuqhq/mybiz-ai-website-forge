
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Shield, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PasswordGenerator: React.FC = () => {
  const { toast } = useToast();
  const [length, setLength] = useState(12);
  const [includeUpperCase, setIncludeUpperCase] = useState(true);
  const [includeLowerCase, setIncludeLowerCase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [strength, setStrength] = useState('');

  const generatePassword = () => {
    let charset = '';
    if (includeUpperCase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowerCase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setGeneratedPassword(password);
    calculateStrength(password);
  };

  const calculateStrength = (password: string) => {
    let score = 0;
    
    // Length score
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character variety score
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Common patterns (negative score)
    if (/123|abc|qwe|asd|zxc/i.test(password)) score -= 1;
    if (/(.)\1{2,}/.test(password)) score -= 1;

    if (score <= 2) setStrength('Weak');
    else if (score <= 4) setStrength('Moderate');
    else if (score <= 6) setStrength('Strong');
    else setStrength('Very Strong');
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: "Password Copied!",
      description: "The password has been copied to your clipboard.",
    });
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'Weak': return 'text-red-600 bg-red-50 border-red-200';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Strong': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Very Strong': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Secure Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Length Control */}
        <div>
          <Label htmlFor="length">Password Length: {length}</Label>
          <input
            id="length"
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="space-y-3">
          <Label>Character Types</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={includeUpperCase}
                onCheckedChange={(checked) => setIncludeUpperCase(checked === true)}
              />
              <label htmlFor="uppercase" className="text-sm">
                Uppercase Letters (A-Z)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={includeLowerCase}
                onCheckedChange={(checked) => setIncludeLowerCase(checked === true)}
              />
              <label htmlFor="lowercase" className="text-sm">
                Lowercase Letters (a-z)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
              />
              <label htmlFor="numbers" className="text-sm">
                Numbers (0-9)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={includeSymbols}
                onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
              />
              <label htmlFor="symbols" className="text-sm">
                Symbols (!@#$%^&*)
              </label>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generatePassword} className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Password
        </Button>

        {/* Generated Password */}
        {generatedPassword && (
          <div className="space-y-4">
            <div>
              <Label>Generated Password</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  value={generatedPassword}
                  readOnly
                  className="font-mono"
                />
                <Button onClick={copyPassword} variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Strength Indicator */}
            <div>
              <Label>Password Strength</Label>
              <Badge className={`mt-2 ${getStrengthColor()}`}>
                {strength}
              </Badge>
            </div>

            {/* Security Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Security Tips:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use a unique password for each account</li>
                <li>• Consider using a password manager</li>
                <li>• Enable two-factor authentication where possible</li>
                <li>• Don't share passwords via email or text</li>
                <li>• Change passwords regularly for sensitive accounts</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;
