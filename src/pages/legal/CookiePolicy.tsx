
import React from 'react';
import { Cookie } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Cookie className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Cookie Policy</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Cookie Policy
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Last updated: January 2024
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-100">
          <div className="prose prose-lg max-w-none">
            <h2>What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our platform.
            </p>

            <h2>How We Use Cookies</h2>
            <p>mybiz AI uses cookies for the following purposes:</p>

            <h3>Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly:</p>
            <ul>
              <li>Authentication and session management</li>
              <li>Security features and fraud prevention</li>
              <li>Basic website functionality</li>
              <li>Load balancing and performance optimization</li>
            </ul>

            <h3>Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with our website:</p>
            <ul>
              <li>Page views and user behavior tracking</li>
              <li>Performance metrics and error reporting</li>
              <li>Feature usage and conversion tracking</li>
              <li>A/B testing and optimization</li>
            </ul>

            <h3>Preference Cookies</h3>
            <p>These cookies remember your settings and preferences:</p>
            <ul>
              <li>Language and region preferences</li>
              <li>Theme and display settings</li>
              <li>Dashboard layout and customizations</li>
              <li>Notification preferences</li>
            </ul>

            <h2>Third-Party Cookies</h2>
            <p>We may also use third-party services that set cookies on our website:</p>
            <ul>
              <li><strong>Google Analytics:</strong> For website traffic analysis</li>
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Cloudflare:</strong> For security and performance</li>
              <li><strong>Intercom:</strong> For customer support chat</li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>You can control cookies through your browser settings:</p>

            <h3>Browser Settings</h3>
            <ul>
              <li>Most browsers allow you to view, delete, and block cookies</li>
              <li>You can set your browser to notify you when cookies are being used</li>
              <li>You can choose to accept or reject cookies on a site-by-site basis</li>
            </ul>

            <h3>Opt-Out Options</h3>
            <ul>
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout">opt-out tool</a></li>
              <li>Most advertising networks provide opt-out mechanisms</li>
              <li>You can use privacy-focused browser extensions</li>
            </ul>

            <h2>Cookie Retention</h2>
            <p>We retain cookies for different periods depending on their purpose:</p>
            <ul>
              <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain for a set period (usually 1-2 years)</li>
              <li><strong>Analytics cookies:</strong> Typically retained for 26 months</li>
            </ul>

            <h2>Impact of Disabling Cookies</h2>
            <p>
              If you choose to disable cookies, some features of our website may not function properly:
            </p>
            <ul>
              <li>You may need to log in repeatedly</li>
              <li>Your preferences may not be saved</li>
              <li>Some interactive features may not work</li>
              <li>We may not be able to personalize your experience</li>
            </ul>

            <h2>Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. When we make changes, we will update the "Last updated" date at the top of this policy and notify you through our website or email.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at:
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

export default CookiePolicy;
