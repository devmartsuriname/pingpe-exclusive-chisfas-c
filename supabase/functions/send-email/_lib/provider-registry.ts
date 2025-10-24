import type { EmailProvider, EmailConfig } from "./email-provider.ts";
import { HostingerSmtpEmailProvider } from "./hostinger-provider.ts";
import { ResendEmailProvider } from "./resend-provider.ts";

export class EmailProviderRegistry {
  static getProvider(config: EmailConfig): EmailProvider | null {
    // Check primary provider first
    if (config.provider === 'hostinger' && config.hostinger?.enabled) {
      return new HostingerSmtpEmailProvider(config.hostinger);
    }
    
    if (config.provider === 'resend' && config.resend?.enabled) {
      return new ResendEmailProvider(config.resend);
    }

    // Fallback: check if any provider is enabled
    if (config.hostinger?.enabled) {
      return new HostingerSmtpEmailProvider(config.hostinger);
    }

    if (config.resend?.enabled) {
      return new ResendEmailProvider(config.resend);
    }

    return null;
  }

  static async loadConfigFromSettings(supabaseClient: any): Promise<EmailConfig> {
    const { data: settings, error } = await supabaseClient
      .from('settings')
      .select('key, value')
      .in('key', [
        'email_provider',
        'email_hostinger_enabled',
        'email_hostinger_smtp_host',
        'email_hostinger_smtp_port',
        'email_hostinger_smtp_username',
        'email_hostinger_smtp_password',
        'email_hostinger_smtp_secure',
        'email_hostinger_from_name',
        'email_hostinger_from_email',
        'email_hostinger_reply_to',
        'email_resend_enabled',
        'resend_api_key',
        'resend_sender_name',
        'resend_sender_email',
      ]);

    if (error) {
      console.error('Failed to load email settings:', error);
      throw new Error('Failed to load email configuration');
    }

    const getSetting = (key: string, defaultValue: any = null) => {
      const setting = settings?.find((s: any) => s.key === key);
      return setting?.value ?? defaultValue;
    };

    const provider = getSetting('email_provider', 'hostinger');

    const config: EmailConfig = {
      provider: provider as 'hostinger' | 'resend',
      hostinger: {
        enabled: getSetting('email_hostinger_enabled', false),
        host: getSetting('email_hostinger_smtp_host', ''),
        port: parseInt(getSetting('email_hostinger_smtp_port', '465')),
        username: getSetting('email_hostinger_smtp_username', ''),
        password: getSetting('email_hostinger_smtp_password', ''),
        secure: getSetting('email_hostinger_smtp_secure', true),
        fromName: getSetting('email_hostinger_from_name', 'Jungle Resort PingPe'),
        fromEmail: getSetting('email_hostinger_from_email', ''),
        replyTo: getSetting('email_hostinger_reply_to'),
      },
      resend: {
        enabled: getSetting('email_resend_enabled', false),
        apiKey: getSetting('resend_api_key', ''),
        fromName: getSetting('resend_sender_name', 'Jungle Resort PingPe'),
        fromEmail: getSetting('resend_sender_email', ''),
      },
    };

    return config;
  }
}
