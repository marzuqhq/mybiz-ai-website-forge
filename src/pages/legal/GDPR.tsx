
import React from 'react';
import { Shield } from 'lucide-react';

const GDPR = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">GDPR Compliance</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            GDPR Compliance
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your rights under the General Data Protection Regulation
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-100">
          <div className="prose prose-lg max-w-none">
            <h2>Our Commitment to GDPR</h2>
            <p>
              mybiz AI is committed to protecting your privacy and ensuring compliance with the General Data Protection Regulation (GDPR). This page outlines your rights and how we handle your personal data in accordance with GDPR requirements.
            </p>

            <h2>Your GDPR Rights</h2>
            <p>Under GDPR, you have the following rights regarding your personal data:</p>

            <h3>Right to Information</h3>
            <p>You have the right to be informed about:</p>
            <ul>
              <li>What personal data we collect</li>
              <li>How we use your personal data</li>
              <li>Who we share your data with</li>
              <li>How long we retain your data</li>
              <li>Your rights regarding your data</li>
            </ul>

            <h3>Right of Access</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Request a copy of your personal data</li>
              <li>Receive information about how we process your data</li>
              <li>Get confirmation that we are processing your data</li>
            </ul>

            <h3>Right to Rectification</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Correct inaccurate personal data</li>
              <li>Complete incomplete personal data</li>
              <li>Update outdated information</li>
            </ul>

            <h3>Right to Erasure (Right to be Forgotten)</h3>
            <p>You have the right to request deletion of your personal data when:</p>
            <ul>
              <li>The data is no longer necessary for the original purpose</li>
              <li>You withdraw consent and there's no other legal basis</li>
              <li>The data has been unlawfully processed</li>
              <li>You object to processing and there are no overriding legitimate grounds</li>
            </ul>

            <h3>Right to Restrict Processing</h3>
            <p>You have the right to restrict processing when:</p>
            <ul>
              <li>You contest the accuracy of your personal data</li>
              <li>Processing is unlawful but you don't want erasure</li>
              <li>We no longer need the data but you need it for legal claims</li>
              <li>You've objected to processing pending verification</li>
            </ul>

            <h3>Right to Data Portability</h3>
            <p>You have the right to:</p>
            <ul>
              <li>Receive your personal data in a structured, commonly used format</li>
              <li>Transfer your data to another service provider</li>
              <li>Have your data transmitted directly to another controller where technically feasible</li>
            </ul>

            <h3>Right to Object</h3>
            <p>You have the right to object to:</p>
            <ul>
              <li>Processing based on legitimate interests</li>
              <li>Direct marketing communications</li>
              <li>Processing for scientific/historical research or statistical purposes</li>
            </ul>

            <h2>Legal Bases for Processing</h2>
            <p>We process your personal data based on the following legal grounds:</p>

            <h3>Consent</h3>
            <ul>
              <li>Marketing communications (where you've opted in)</li>
              <li>Optional features and services</li>
              <li>Cookies (except essential ones)</li>
            </ul>

            <h3>Contract</h3>
            <ul>
              <li>Providing our website building services</li>
              <li>Processing payments</li>
              <li>Customer support</li>
            </ul>

            <h3>Legitimate Interest</h3>
            <ul>
              <li>Improving our services</li>
              <li>Security and fraud prevention</li>
              <li>Analytics and performance monitoring</li>
            </ul>

            <h3>Legal Obligation</h3>
            <ul>
              <li>Tax and accounting requirements</li>
              <li>Regulatory compliance</li>
              <li>Law enforcement requests</li>
            </ul>

            <h2>Data Retention</h2>
            <p>We retain your personal data for the following periods:</p>
            <ul>
              <li><strong>Account data:</strong> Until account deletion plus 30 days</li>
              <li><strong>Website data:</strong> Until website deletion or account closure</li>
              <li><strong>Payment data:</strong> 7 years for tax purposes</li>
              <li><strong>Support data:</strong> 3 years for service improvement</li>
              <li><strong>Analytics data:</strong> 26 months (anonymized)</li>
            </ul>

            <h2>Data Transfers</h2>
            <p>When we transfer your data outside the EEA, we ensure adequate protection through:</p>
            <ul>
              <li>Adequacy decisions by the European Commission</li>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Binding Corporate Rules</li>
              <li>Certification schemes</li>
            </ul>

            <h2>How to Exercise Your Rights</h2>
            <p>To exercise any of your GDPR rights, please:</p>
            <ul>
              <li>Email us at: gdpr@mybiz.ai</li>
              <li>Use the data export/deletion tools in your account settings</li>
              <li>Contact our support team through the help center</li>
            </ul>

            <p>We will respond to your request within one month (extendable to three months for complex requests).</p>

            <h2>Data Protection Officer</h2>
            <p>
              Our Data Protection Officer can be contacted at: dpo@mybiz.ai
            </p>

            <h2>Supervisory Authority</h2>
            <p>
              You have the right to lodge a complaint with your local data protection authority if you believe we have not handled your data properly.
            </p>

            <h2>Updates to This Information</h2>
            <p>
              We may update this GDPR information from time to time. We will notify you of any material changes through email or our website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GDPR;
