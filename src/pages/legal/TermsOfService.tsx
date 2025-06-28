
import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Terms of Service</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Terms of Service
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Last updated: January 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-100">
          <div className="prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using mybiz AI's website building platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              mybiz AI provides an AI-powered website building platform that allows users to create, customize, and publish websites through natural language prompts and automated design systems.
            </p>

            <h2>3. User Accounts</h2>
            <p>When you create an account with us, you must provide accurate and complete information. You are responsible for:</p>
            <ul>
              <li>Safeguarding your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of unauthorized use</li>
              <li>Maintaining accurate account information</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Create content that is illegal, harmful, or offensive</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute malware or harmful code</li>
              <li>Spam or harass other users</li>
              <li>Attempt to breach our security measures</li>
            </ul>

            <h2>5. AI-Generated Content</h2>
            <p>Regarding AI-generated content on our platform:</p>
            <ul>
              <li>AI-generated content is based on your prompts and business information</li>
              <li>You are responsible for reviewing and approving all content before publication</li>
              <li>We do not guarantee the accuracy of AI-generated content</li>
              <li>You retain ownership of content you create, subject to our platform rights</li>
            </ul>

            <h2>6. Subscription and Billing</h2>
            <p>For paid services:</p>
            <ul>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>You can cancel your subscription at any time</li>
              <li>Refunds are provided according to our refund policy</li>
              <li>Price changes will be communicated in advance</li>
            </ul>

            <h2>7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by mybiz AI and protected by copyright, trademark, and other laws. You retain ownership of content you create using our platform.
            </p>

            <h2>8. Website Hosting and Domains</h2>
            <p>For websites created on our platform:</p>
            <ul>
              <li>We provide hosting services as part of our platform</li>
              <li>Custom domains can be connected according to your plan</li>
              <li>We maintain 99.9% uptime guarantee</li>
              <li>Website data is backed up regularly</li>
            </ul>

            <h2>9. Privacy and Data</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>

            <h2>10. Disclaimers</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.
            </p>

            <h2>11. Limitation of Liability</h2>
            <p>
              In no event shall mybiz AI be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits or data.
            </p>

            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
            </p>

            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes through email or platform notifications.
            </p>

            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of [Jurisdiction], without regard to conflict of law provisions.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@mybiz.ai</li>
              <li>Address: [Company Address]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
