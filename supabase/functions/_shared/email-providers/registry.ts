import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { EmailProvider, EmailConfig } from "./interface.ts";
import { HostingerSMTP } from "./hostinger.ts";
import { ResendProvider } from "./resend.ts";

/**
 * Load email configuration from Supabase settings table
 */
export async function loadEmailConfig(supabaseClient: any): Promise<EmailConfig> {
  const { data: settings, error } = await supabaseClient
    .from('settings')
    .select('key, value')
    .in('key', [
      'email_provider',
      'email_hostinger_enabled',
      'email_hostinger_host',
      'email_hostinger_port',
      'email_hostinger_username',
      'email_hostinger_password',
      'email_hostinger_from_email',
      'email_hostinger_from_name',
      'email_resend_enabled',
      'email_resend_api_key',
      'email_resend_from_email',
      'email_resend_from_name',
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
    provider: config.email_provider || 'hostinger',
    hostinger: {
      enabled: config.email_hostinger_enabled || false,
      host: config.email_hostinger_host || '',
      port: config.email_hostinger_port || 465,
      username: config.email_hostinger_username || '',
      password: config.email_hostinger_password || '',
      from_email: config.email_hostinger_from_email || '',
      from_name: config.email_hostinger_from_name || 'PingPe',
    },
    resend: {
      enabled: config.email_resend_enabled || false,
      api_key: config.email_resend_api_key || '',
      from_email: config.email_resend_from_email || '',
      from_name: config.email_resend_from_name || 'PingPe',
    },
  };

  return emailConfig;
}

/**
 * Get the active email provider instance
 */
export async function getEmailProvider(supabaseClient: any): Promise<EmailProvider> {
  const config = await loadEmailConfig(supabaseClient);

  // Determine which provider to use
  let provider: EmailProvider;

  if (config.provider === 'resend' && config.resend?.enabled && config.resend.api_key) {
    provider = new ResendProvider(config.resend);
    console.log('[EmailRegistry] Using Resend provider');
  } else if (config.hostinger?.enabled && config.hostinger.host && config.hostinger.username) {
    provider = new HostingerSMTP(config.hostinger);
    console.log('[EmailRegistry] Using Hostinger SMTP provider');
  } else {
    throw new Error('No email provider is configured and enabled');
  }

  return provider;
}

/**
 * Get a specific provider by name (for testing)
 */
export async function getProviderByName(
  supabaseClient: any,
  providerName: 'hostinger' | 'resend'
): Promise<EmailProvider> {
  const config = await loadEmailConfig(supabaseClient);

  if (providerName === 'resend') {
    if (!config.resend?.enabled || !config.resend.api_key) {
      throw new Error('Resend is not configured');
    }
    return new ResendProvider(config.resend);
  } else {
    if (!config.hostinger?.enabled || !config.hostinger.host) {
      throw new Error('Hostinger SMTP is not configured');
    }
    return new HostingerSMTP(config.hostinger);
  }
}
