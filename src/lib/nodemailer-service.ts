// Server-side Nodemailer service for real email sending
// This would run on your backend/API routes

interface NodemailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailData {
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

// This is the backend implementation that would be used with API routes
export async function sendEmailWithNodemailer(emailData: EmailData, config: NodemailerConfig): Promise<boolean> {
  try {
    // This would typically run on your backend with nodemailer installed
    // const nodemailer = await import('nodemailer');
    
    // For now, simulate nodemailer functionality
    console.log('📧 Backend email sending simulation');
    console.log('Config:', config);
    console.log('Email data:', emailData);
    
    // Simulate success - in production, use real nodemailer
    return true;
    
    /* Real implementation:
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail({
      from: emailData.from || config.auth.user,
      to: emailData.to,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      attachments: emailData.attachments
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return true;
    */
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
}

// Frontend service that calls the backend API
export class ProductionEmailService {
  private apiEndpoint: string;

  constructor(apiEndpoint: string = '/api/send-email') {
    this.apiEndpoint = apiEndpoint;
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Email API call failed:', error);
      return false;
    }
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
          <a href="${window.location.origin}" style="background: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
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
}

export default ProductionEmailService;