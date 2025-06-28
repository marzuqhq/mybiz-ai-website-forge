
import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Privacy Policy</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Last updated: January 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-100">
          <div className="prose prose-lg max-w-none">
            <h2>Introduction</h2>
            <p>
              At mybiz AI ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered website building platform.
            </p>

            <h2>Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>When you use our service, we may collect the following personal information:</p>
            <ul>
              <li>Name and email address</li>
              <li>Business information you provide for website generation</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Usage Information</h3>
            <p>We automatically collect certain information about your use of our platform:</p>
            <ul>
              <li>IP address and browser information</li>
              <li>Pages visited and features used</li>
              <li>Time spent on the platform</li>
              <li>AI prompt interactions and generated content</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>To provide and improve our AI website building services</li>
              <li>To generate personalized website content based on your business description</li>
              <li>To process payments and manage your account</li>
              <li>To communicate with you about updates, features, and support</li>
              <li>To analyze usage patterns and improve our platform</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2>AI and Data Processing</h2>
            <p>
              Our platform uses advanced AI models to generate website content. When you provide business descriptions or prompts:
            </p>
            <ul>
              <li>Your prompts are processed by our AI systems to generate relevant content</li>
              <li>We may store prompts and generated content to improve our services</li>
              <li>We do not share your specific prompts with third parties without consent</li>
              <li>AI processing is done securely with enterprise-grade encryption</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>We do not sell your personal information. We may share information in the following circumstances:</p>
            <ul>
              <li>With service providers who help us operate our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transaction (merger, acquisition, etc.)</li>
              <li>With your explicit consent</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure cloud infrastructure</li>
            </ul>

            <h2>Your Rights</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li>Access: Request a copy of your personal information</li>
              <li>Correction: Request correction of inaccurate information</li>
              <li>Deletion: Request deletion of your personal information</li>
              <li>Portability: Request transfer of your data</li>
              <li>Objection: Object to certain processing activities</li>
            </ul>

            <h2>Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul>
              <li>Essential cookies for platform functionality</li>
              <li>Analytics cookies to understand usage patterns</li>
              <li>Preference cookies to remember your settings</li>
            </ul>
            <p>You can manage cookie preferences through your browser settings.</p>

            <h2>International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your residence. We ensure appropriate safeguards are in place for international transfers.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2>Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes through email or platform notifications.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or your personal information, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@mybiz.ai</li>
              <li>Address: [Company Address]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
