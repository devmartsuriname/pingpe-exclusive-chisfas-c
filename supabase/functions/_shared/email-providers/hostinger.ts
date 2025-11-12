import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { EmailProvider, EmailMessage, EmailResult } from "./interface.ts";

export class HostingerSMTP extends EmailProvider {
  async send(message: EmailMessage): Promise<EmailResult> {
    try {
      const client = new SMTPClient({
        connection: {
          hostname: this.config.host,
          port: this.config.port,
          tls: this.config.secure !== false, // Use configured secure setting, default true
          auth: {
            username: this.config.username,
            password: this.config.password,
          },
        },
      });

      await client.send({
        from: `${this.config.from_name} <${this.config.from_email}>`,
        to: message.to,
        subject: message.subject,
        content: message.text || '',
        html: message.html,
      });

      await client.close();

      return {
        success: true,
        messageId: `hostinger-${Date.now()}`,
      };
    } catch (error: any) {
      console.error('[HostingerSMTP] Send error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email via Hostinger SMTP',
      };
    }
  }

  async testConnection(): Promise<EmailResult> {
    try {
      const client = new SMTPClient({
        connection: {
          hostname: this.config.host,
          port: this.config.port,
          tls: this.config.secure !== false, // Use configured secure setting, default true
          auth: {
            username: this.config.username,
            password: this.config.password,
          },
        },
      });

      await client.close();

      return {
        success: true,
        messageId: 'connection-test-ok',
      };
    } catch (error: any) {
      console.error('[HostingerSMTP] Connection test error:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect to Hostinger SMTP',
      };
    }
  }

  getProviderName(): string {
    return 'Hostinger SMTP';
  }
}
