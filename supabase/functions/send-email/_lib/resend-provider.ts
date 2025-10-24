import { Resend } from "https://esm.sh/resend@4.0.0";
import type { EmailProvider, SendEmailParams, EmailResult, EmailConfig } from "./email-provider.ts";

export class ResendEmailProvider implements EmailProvider {
  private resend: Resend;
  private config: NonNullable<EmailConfig['resend']>;

  constructor(config: NonNullable<EmailConfig['resend']>) {
    this.config = config;
    this.resend = new Resend(config.apiKey);
  }

  async sendEmail(params: SendEmailParams): Promise<EmailResult> {
    try {
      const fromEmail = params.from?.email || this.config.fromEmail;
      const fromName = params.from?.name || this.config.fromName;

      const { data, error } = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
        reply_to: params.replyTo,
      });

      if (error) {
        console.error('Resend API error:', error);
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
      console.error('Resend error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email via Resend',
      };
    }
  }

  async testConnection(): Promise<boolean> {
    // Resend doesn't have a dedicated test endpoint, so we assume it's configured if we have an API key
    return !!this.config.apiKey && this.config.apiKey.startsWith('re_');
  }
}
