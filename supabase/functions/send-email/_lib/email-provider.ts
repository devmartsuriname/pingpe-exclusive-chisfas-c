// Email Provider Interface
export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<EmailResult>;
  testConnection(): Promise<boolean>;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: {
    name: string;
    email: string;
  };
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailConfig {
  provider: 'hostinger' | 'resend';
  hostinger?: {
    enabled: boolean;
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
    fromName: string;
    fromEmail: string;
    replyTo?: string;
  };
  resend?: {
    enabled: boolean;
    apiKey: string;
    fromName: string;
    fromEmail: string;
  };
}
