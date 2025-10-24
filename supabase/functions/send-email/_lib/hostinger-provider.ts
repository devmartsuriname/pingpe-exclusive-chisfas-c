import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import type { EmailProvider, SendEmailParams, EmailResult, EmailConfig } from "./email-provider.ts";

export class HostingerSmtpEmailProvider implements EmailProvider {
  private config: NonNullable<EmailConfig['hostinger']>;

  constructor(config: NonNullable<EmailConfig['hostinger']>) {
    this.config = config;
  }

  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    try {
      const client = new SMTPClient({
        connection: {
          hostname: this.config.host,
          port: this.config.port,
          tls: this.config.secure,
          auth: {
            username: this.config.username,
            password: this.config.password,
          },
        },
      });

      const fromEmail = params.from?.email || this.config.fromEmail;
      const fromName = params.from?.name || this.config.fromName;

      await client.send({
        from: `${fromName} <${fromEmail}>`,
        to: Array.isArray(params.to) ? params.to.join(', ') : params.to,
        subject: params.subject,
        html: params.html,
        replyTo: params.replyTo || this.config.replyTo,
      });

      await client.close();

      return {
        success: true,
        messageId: `hostinger-${Date.now()}`,
      };
    } catch (error: any) {
      console.error('Hostinger SMTP error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email via Hostinger SMTP',
      };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = new SMTPClient({
        connection: {
          hostname: this.config.host,
          port: this.config.port,
          tls: this.config.secure,
          auth: {
            username: this.config.username,
            password: this.config.password,
          },
        },
      });

      await client.close();
      return true;
    } catch (error) {
      console.error('Hostinger SMTP test connection failed:', error);
      return false;
    }
  }
}
