
import React from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';

const Security = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Security</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Security & Trust
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            How we protect your data and ensure the security of our platform
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-100">
          <div className="prose prose-lg max-w-none">
            <h2>Our Security Commitment</h2>
            <p>
              At mybiz AI, security is fundamental to everything we do. We implement industry-leading security measures to protect your data, websites, and business information. Our security practices are designed to meet the highest standards and provide you with peace of mind.
            </p>

            <h2>Data Protection Measures</h2>

            <h3>Encryption</h3>
            <p>We protect your data with multiple layers of encryption:</p>
            <ul>
              <li><strong>Data in Transit:</strong> All data is encrypted using TLS 1.3 protocol</li>
              <li><strong>Data at Rest:</strong> All stored data is encrypted using AES-256 encryption</li>
              <li><strong>Database Encryption:</strong> All database connections and storage are encrypted</li>
              <li><strong>Backup Encryption:</strong> All backups are encrypted and stored securely</li>
            </ul>

            <h3>Access Controls</h3>
            <p>We implement strict access controls to protect your information:</p>
            <ul>
              <li>Multi-factor authentication for all team members</li>
              <li>Role-based access control (RBAC) for different permission levels</li>
              <li>Regular access reviews and deprovisioning</li>
              <li>Principle of least privilege for all system access</li>
            </ul>

            <h3>Network Security</h3>
            <p>Our infrastructure is protected by advanced network security measures:</p>
            <ul>
              <li>Web Application Firewall (WAF) protection</li>
              <li>DDoS protection and mitigation</li>
              <li>Intrusion detection and prevention systems</li>
              <li>Network segmentation and isolation</li>
            </ul>

            <h2>Infrastructure Security</h2>

            <h3>Cloud Security</h3>
            <p>We leverage enterprise-grade cloud infrastructure:</p>
            <ul>
              <li>SOC 2 Type II certified cloud providers</li>
              <li>ISO 27001 certified data centers</li>
              <li>Automated security monitoring and alerting</li>
              <li>Regular security audits and assessments</li>
            </ul>

            <h3>Application Security</h3>
            <p>Our applications are built with security-first principles:</p>
            <ul>
              <li>Secure coding practices and code reviews</li>
              <li>Regular vulnerability scanning and penetration testing</li>
              <li>Automated security testing in CI/CD pipelines</li>
              <li>Security headers and content security policies</li>
            </ul>

            <h2>Compliance & Certifications</h2>
            <p>We adhere to industry standards and regulations:</p>

            <h3>Compliance Standards</h3>
            <ul>
              <li><strong>GDPR:</strong> Full compliance with European data protection regulations</li>
              <li><strong>CCPA:</strong> California Consumer Privacy Act compliance</li>
              <li><strong>SOC 2:</strong> System and Organization Controls audit compliance</li>
              <li><strong>ISO 27001:</strong> Information security management standards</li>
            </ul>

            <h3>Security Frameworks</h3>
            <ul>
              <li>OWASP Top 10 security practices</li>
              <li>NIST Cybersecurity Framework</li>
              <li>CIS Controls implementation</li>
              <li>Zero Trust security model</li>
            </ul>

            <h2>Monitoring & Incident Response</h2>

            <h3>24/7 Security Monitoring</h3>
            <p>We maintain continuous security monitoring:</p>
            <ul>
              <li>Real-time threat detection and alerting</li>
              <li>Security information and event management (SIEM)</li>
              <li>Automated incident response procedures</li>
              <li>Regular security metrics and reporting</li>
            </ul>

            <h3>Incident Response</h3>
            <p>We have a comprehensive incident response plan:</p>
            <ul>
              <li>Immediate threat containment and mitigation</li>
              <li>Forensic analysis and root cause investigation</li>
              <li>Stakeholder communication and transparency</li>
              <li>Post-incident review and improvements</li>
            </ul>

            <h2>Privacy by Design</h2>
            <p>We implement privacy and security from the ground up:</p>
            <ul>
              <li>Data minimization - we only collect what we need</li>
              <li>Purpose limitation - data is only used for stated purposes</li>
              <li>Transparency - clear information about data handling</li>
              <li>User control - you control your data and privacy settings</li>
            </ul>

            <h2>Website Security</h2>

            <h3>Hosted Website Protection</h3>
            <p>Websites created with mybiz AI benefit from:</p>
            <ul>
              <li>Automatic SSL/TLS certificates</li>
              <li>CDN-based DDoS protection</li>
              <li>Regular security updates and patches</li>
              <li>Malware scanning and removal</li>
            </ul>

            <h3>Performance & Availability</h3>
            <ul>
              <li>99.9% uptime guarantee</li>
              <li>Global CDN for fast loading times</li>
              <li>Automatic failover and redundancy</li>
              <li>Regular performance monitoring</li>
            </ul>

            <h2>Team Security</h2>

            <h3>Security Training</h3>
            <p>Our team receives ongoing security training:</p>
            <ul>
              <li>Security awareness and best practices</li>
              <li>Phishing and social engineering prevention</li>
              <li>Secure development lifecycle training</li>
              <li>Incident response and emergency procedures</li>
            </ul>

            <h3>Background Checks</h3>
            <p>All team members undergo:</p>
            <ul>
              <li>Background verification and screening</li>
              <li>Confidentiality and security agreements</li>
              <li>Regular security clearance reviews</li>
              <li>Secure device and access management</li>
            </ul>

            <h2>Reporting Security Issues</h2>
            <p>
              If you discover a security vulnerability, please report it to us immediately:
            </p>
            <ul>
              <li>Email: security@mybiz.ai</li>
              <li>We will acknowledge receipt within 24 hours</li>
              <li>We will investigate and respond within 72 hours</li>
              <li>We appreciate responsible disclosure</li>
            </ul>

            <h2>Questions About Security</h2>
            <p>
              For any security-related questions or concerns, please contact:
            </p>
            <ul>
              <li>Security Team: security@mybiz.ai</li>
              <li>Privacy Officer: privacy@mybiz.ai</li>
              <li>General Inquiries: support@mybiz.ai</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
