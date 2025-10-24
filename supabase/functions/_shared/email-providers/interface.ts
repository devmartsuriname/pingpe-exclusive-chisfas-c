/**
 * Email Provider Interface
 * Defines the contract for all email providers (Hostinger SMTP, Resend, etc.)
 */

export interface EmailConfig {
  provider: 'hostinger' | 'resend';
  hostinger?: {
    enabled: boolean;
    host: string;
    port: number;
    username: string;
    password: string;
    from_email: string;
    from_name: string;
  };
  resend?: {
    enabled: boolean;
    api_key: string;
    from_email: string;
    from_name: string;
  };
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export abstract class EmailProvider {
  protected config: any;

  constructor(config: any) {
    this.config = config;
  }

  /**
   * Send an email using this provider
   */
  abstract send(message: EmailMessage): Promise<EmailResult>;

  /**
   * Test the connection/configuration
   */
  abstract testConnection(): Promise<EmailResult>;

  /**
   * Get the provider name
   */
  abstract getProviderName(): string;
}
