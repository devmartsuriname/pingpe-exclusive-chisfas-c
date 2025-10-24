import { Resend as ResendSDK } from "https://esm.sh/resend@2.0.0";
import { EmailProvider, EmailMessage, EmailResult } from "./interface.ts";

export class ResendProvider extends EmailProvider {
  private client: ResendSDK;

  constructor(config: any) {
    super(config);
    this.client = new ResendSDK(config.api_key);
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: `${this.config.from_name} <${this.config.from_email}>`,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      });

      if (error) {
        console.error('[ResendProvider] Send error:', error);
        return {
          success: false,
          error: error.message || 'Failed to send email via Resend',
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (error: any) {
      console.error('[ResendProvider] Send exception:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email via Resend',
      };
    }
  }

  async testConnection(): Promise<EmailResult> {
    try {
      // Resend doesn't have a dedicated connection test,
      // so we just verify the API key format
      if (!this.config.api_key || !this.config.api_key.startsWith('re_')) {
        return {
          success: false,
          error: 'Invalid Resend API key format',
        };
      }

      return {
        success: true,
        messageId: 'api-key-valid',
      };
    } catch (error: any) {
      console.error('[ResendProvider] Connection test error:', error);
      return {
        success: false,
        error: error.message || 'Failed to validate Resend API key',
      };
    }
  }

  getProviderName(): string {
    return 'Resend';
  }
}
