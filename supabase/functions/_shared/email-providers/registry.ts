import { EmailProvider, EmailConfig } from "./interface.ts";
import { HostingerSMTP } from "./hostinger.ts";

/**
 * Load email configuration from Supabase settings table
 */
export async function loadEmailConfig(supabaseClient: any): Promise<EmailConfig> {
  const { data: settings, error } = await supabaseClient
    .from('settings')
    .select('key, value')
    .in('key', [
      'email_hostinger_enabled',
      'email_hostinger_host',
      'email_hostinger_port',
      'email_hostinger_username',
      'email_hostinger_password',
      'email_hostinger_from_email',
      'email_hostinger_from_name',
    ]);

  if (error) {
    console.error('[EmailRegistry] Failed to load email config:', error);
    throw new Error('Failed to load email configuration');
  }

  const config: any = {};
  settings?.forEach((setting: any) => {
    config[setting.key] = setting.value;
  });

  const emailConfig: EmailConfig = {
    provider: 'hostinger',
    hostinger: {
      enabled: config.email_hostinger_enabled || false,
      host: config.email_hostinger_host || '',
      port: config.email_hostinger_port || 465,
      username: config.email_hostinger_username || '',
      password: config.email_hostinger_password || '',
      from_email: config.email_hostinger_from_email || '',
      from_name: config.email_hostinger_from_name || 'PingPe',
    },
  };

  return emailConfig;
}

/**
 * Get the active email provider instance (Hostinger SMTP only)
 */
export async function getEmailProvider(supabaseClient: any): Promise<EmailProvider> {
  const config = await loadEmailConfig(supabaseClient);

  if (!config.hostinger.enabled || !config.hostinger.host || !config.hostinger.username) {
    throw new Error('Hostinger SMTP is not configured and enabled');
  }

  console.log('[EmailRegistry] Using Hostinger SMTP provider');
  return new HostingerSMTP(config.hostinger);
}
