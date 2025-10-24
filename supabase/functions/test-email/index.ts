import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  to: string;
  provider?: 'hostinger' | 'resend';
}

interface EmailConfig {
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

async function loadEmailConfig(supabaseClient: any): Promise<EmailConfig> {
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

  return {
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
}

async function testHostingerConnection(config: NonNullable<EmailConfig['hostinger']>): Promise<boolean> {
  try {
    const client = new SMTPClient({
      connection: {
        hostname: config.host,
        port: config.port,
        tls: config.secure,
        auth: {
          username: config.username,
          password: config.password,
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

async function sendTestEmailViaHostinger(config: NonNullable<EmailConfig['hostinger']>, to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const client = new SMTPClient({
      connection: {
        hostname: config.host,
        port: config.port,
        tls: config.secure,
        auth: {
          username: config.username,
          password: config.password,
        },
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">🎉 Email Configuration Test</h2>
        <p style="color: #666; line-height: 1.6;">
          Congratulations! Your Hostinger SMTP email service is configured correctly and working.
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Provider:</strong> Hostinger SMTP</p>
          <p style="margin: 5px 0 0 0; color: #333;"><strong>Sent to:</strong> ${to}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Sent from Jungle Resort PingPe<br />
          Vidijaweg 25, Wanica, Suriname<br />
          +597 8858525
        </p>
      </div>
    `;

    await client.send({
      from: `${config.fromName} <${config.fromEmail}>`,
      to,
      subject: 'Test Email - Hostinger SMTP Configuration',
      html,
      replyTo: config.replyTo,
    });

    await client.close();

    return {
      success: true,
      messageId: `hostinger-test-${Date.now()}`,
    };
  } catch (error: any) {
    console.error('Hostinger SMTP test email error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send test email via Hostinger SMTP',
    };
  }
}

async function sendTestEmailViaResend(config: NonNullable<EmailConfig['resend']>, to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = new Resend(config.apiKey);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">🎉 Email Configuration Test</h2>
        <p style="color: #666; line-height: 1.6;">
          Congratulations! Your Resend email service is configured correctly and working.
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Provider:</strong> Resend API</p>
          <p style="margin: 5px 0 0 0; color: #333;"><strong>Sent to:</strong> ${to}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">
          Sent from Jungle Resort PingPe<br />
          Vidijaweg 25, Wanica, Suriname<br />
          +597 8858525
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: [to],
      subject: 'Test Email - Resend Configuration',
      html,
    });

    if (error) {
      console.error('Resend test email error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send test email via Resend',
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
      error: error.message || 'Failed to send test email via Resend',
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { to, provider }: TestEmailRequest = await req.json();

    if (!to) {
      throw new Error('Missing required field: to');
    }

    const emailConfig = await loadEmailConfig(supabaseClient);

    // Determine which provider to test
    const providerToTest = provider || emailConfig.provider;

    if (providerToTest === 'hostinger') {
      if (!emailConfig.hostinger?.enabled) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Hostinger SMTP is not enabled',
            configured: false,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 503,
          }
        );
      }

      const connectionOk = await testHostingerConnection(emailConfig.hostinger);
      if (!connectionOk) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Hostinger SMTP connection test failed. Please verify your configuration.',
            configured: true,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      const result = await sendTestEmailViaHostinger(emailConfig.hostinger, to);
      
      if (!result.success) {
        return new Response(
          JSON.stringify({
            success: false,
            error: result.error,
            configured: true,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          provider: 'hostinger',
          messageId: result.messageId,
          to,
          message: 'Test email sent successfully via Hostinger SMTP',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      if (!emailConfig.resend?.enabled) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Resend is not enabled',
            configured: false,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 503,
          }
        );
      }

      if (!emailConfig.resend.apiKey || !emailConfig.resend.apiKey.startsWith('re_')) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Invalid Resend API key',
            configured: false,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      const result = await sendTestEmailViaResend(emailConfig.resend, to);
      
      if (!result.success) {
        return new Response(
          JSON.stringify({
            success: false,
            error: result.error,
            configured: true,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          provider: 'resend',
          messageId: result.messageId,
          to,
          message: 'Test email sent successfully via Resend',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error: any) {
    console.error('Error in test-email function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to send test email',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
