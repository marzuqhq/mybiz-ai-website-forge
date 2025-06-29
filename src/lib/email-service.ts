
interface EmailConfig {
  service: string;
  user: string;
  pass: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class EmailService {
  private config: EmailConfig;
  
  constructor() {
    this.config = {
      service: 'gmail',
      user: import.meta.env.VITE_GMAIL_USER || '',
      pass: import.meta.env.VITE_GMAIL_APP_PASSWORD || '',
    };
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // For demo purposes, we'll use a mock email service
      if (this.config.user && this.config.pass) {
        // In production, this would use Nodemailer with actual Gmail SMTP
        const emailData = {
          service: this.config.service,
          auth: {
            user: this.config.user,
            pass: this.config.pass,
          },
          to: options.to,
          from: options.from || this.config.user,
          subject: options.subject,
          html: options.html,
        };

        // Make API call to backend email service
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        if (!response.ok) {
          throw new Error('Failed to send email');
        }

        return true;
      } else {
        // Demo mode - log email instead of sending
        console.log('📧 Email would be sent:', {
          to: options.to,
          subject: options.subject,
          preview: options.html.substring(0, 100) + '...',
        });
        return true;
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendOTP(email: string, otp: string, reason: string = 'verification'): Promise<boolean> {
    const template = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAFA; padding: 40px;">
        <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #6366F1; font-size: 24px; font-weight: 600; margin: 0;">mybiz AI</h2>
            <p style="color: #64748B; margin: 8px 0 0 0;">Your AI-powered website builder</p>
          </div>
          <h3 style="color: #0F172A; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Your Verification Code</h3>
          <p style="color: #475569; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">Your one-time password for ${reason} is:</p>
          <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); padding: 20px; text-align: center; font-size: 28px; font-weight: bold; margin: 24px 0; border-radius: 8px; color: white; letter-spacing: 2px;">
            ${otp}
          </div>
          <p style="color: #64748B; font-size: 14px; text-align: center; margin: 0;">This code will expire in 10 minutes.</p>
        </div>
        <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 20px;">
          © 2024 mybiz AI. All rights reserved.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `mybiz AI - Verification Code for ${reason}`,
      html: template,
    });
  }

  async sendWelcomeEmail(email: string, name: string = ''): Promise<boolean> {
    const template = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFAFA; padding: 40px;">
        <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #6366F1; font-size: 24px; font-weight: 600; margin: 0;">Welcome to mybiz AI!</h2>
            <p style="color: #64748B; margin: 8px 0 0 0;">Your Website. Described, Not Designed.</p>
          </div>
          ${name ? `<p style="color: #475569; font-size: 16px; margin-bottom: 16px;">Hi ${name},</p>` : ''}
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Thank you for joining our AI-powered website builder platform. We're excited to help you create a beautiful, 
            functional website by simply describing your business.
          </p>
          <div style="background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); padding: 24px; border-radius: 8px; margin: 24px 0;">
            <h4 style="color: #1E293B; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Get started in 3 simple steps:</h4>
            <ol style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0; padding-left: 20px;">
              <li>Describe your business and target audience</li>
              <li>Let our AI generate your complete website</li>
              <li>Refine and publish with simple prompts</li>
            </ol>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://mybiz.ai/create" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Create Your First Website
            </a>
          </div>
        </div>
        <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 20px;">
          © 2024 mybiz AI. All rights reserved.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to mybiz AI - Create Your Website Today!',
      html: template,
    });
  }
}

export const emailService = new EmailService();
export default emailService;
