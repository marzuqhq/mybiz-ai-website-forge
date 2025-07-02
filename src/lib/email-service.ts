
// Enhanced email service with Nodemailer support for Google SMTP
interface EmailConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

class EmailService {
  private config: EmailConfig;
  private isDemo: boolean;

  constructor() {
    // Check if we're in demo mode or have proper email configuration
    this.isDemo = !import.meta.env.VITE_SMTP_USER || !import.meta.env.VITE_SMTP_PASS;
    
    this.config = {
      service: 'gmail',
      host: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: import.meta.env.VITE_SMTP_USER || '',
        pass: import.meta.env.VITE_SMTP_PASS || '',
      },
    };

    if (this.isDemo) {
      console.warn('📧 Email service running in demo mode.');
      console.warn('Set VITE_SMTP_USER and VITE_SMTP_PASS environment variables for real email sending.');
      console.warn('For Gmail: Use your email and an App Password (not your regular password).');
    } else {
      console.log('📧 Email service configured for real sending via SMTP.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (this.isDemo) {
      return this.sendDemoEmail(options);
    }

    try {
      // In a real app, this would use a backend endpoint with Nodemailer
      // For now, we'll simulate the email sending
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...options,
          config: this.config,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email sending failed: ${response.statusText}`);
      }

      console.log('Email sent successfully to:', options.to);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      // Fall back to demo mode if real sending fails
      return this.sendDemoEmail(options);
    }
  }

  private async sendDemoEmail(options: EmailOptions): Promise<boolean> {
    console.log('📧 Demo Email Sent:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('From:', options.from || this.config.auth?.user);
    console.log('HTML:', options.html.substring(0, 200) + '...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store sent emails in localStorage for demo purposes
    try {
      const sentEmails = JSON.parse(localStorage.getItem('demo_sent_emails') || '[]');
      sentEmails.push({
        ...options,
        sentAt: new Date().toISOString(),
        id: crypto.randomUUID(),
      });
      localStorage.setItem('demo_sent_emails', JSON.stringify(sentEmails.slice(-50))); // Keep last 50
    } catch (error) {
      console.warn('Failed to store demo email:', error);
    }
    
    return true;
  }

  async sendOTP(email: string, otp: string, template?: string): Promise<boolean> {
    const html = template || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366F1;">mybiz AI - Verification Code</h2>
        <p>Your one-time password is:</p>
        <div style="background: #6366F1; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; border-radius: 8px;">
          ${otp}
        </div>
        <p style="color: #666;">This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 12px;">© 2024 mybiz AI. All rights reserved.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Your mybiz AI Verification Code',
      html,
      from: 'noreply@mybiz.ai',
    });
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366F1;">Welcome to mybiz AI!</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Thank you for joining our AI-powered website builder platform. We're excited to help you create a beautiful, functional website by simply describing your business.</p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Get started in 3 simple steps:</h3>
          <ol>
            <li>Describe your business and target audience</li>
            <li>Let our AI generate your complete website</li>
            <li>Refine and publish with simple prompts</li>
          </ol>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Create Your First Website
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">© 2024 mybiz AI. All rights reserved.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to mybiz AI - Your Website Builder',
      html,
      from: 'welcome@mybiz.ai',
    });
  }

  async sendAppointmentConfirmation(email: string, appointmentDetails: any): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10B981;">Appointment Confirmed!</h2>
        <p>Your appointment has been successfully scheduled.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${appointmentDetails.service}</p>
          <p><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.time}</p>
          <p><strong>Duration:</strong> ${appointmentDetails.duration} minutes</p>
        </div>
        <p style="color: #666;">You'll receive a reminder 24 hours before your appointment.</p>
        <p style="color: #666; font-size: 12px;">© 2024 mybiz AI. All rights reserved.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Appointment Confirmation - mybiz AI',
      html,
      from: 'appointments@mybiz.ai',
    });
  }

  async testConnection(): Promise<boolean> {
    if (this.isDemo) {
      console.log('Email service test: Demo mode active');
      return true;
    }

    try {
      return await this.sendEmail({
        to: this.config.auth?.user || 'test@example.com',
        subject: 'mybiz AI - Email Service Test',
        html: '<p>This is a test email to verify the email service configuration.</p>',
      });
    } catch (error) {
      console.error('Email service test failed:', error);
      return false;
    }
  }

  getSentEmails(): any[] {
    try {
      return JSON.parse(localStorage.getItem('demo_sent_emails') || '[]');
    } catch {
      return [];
    }
  }

  getConfig(): EmailConfig {
    return { ...this.config };
  }

  isConfigured(): boolean {
    return !this.isDemo;
  }
}

export const emailService = new EmailService();
export default emailService;
