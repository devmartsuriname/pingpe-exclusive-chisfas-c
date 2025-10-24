import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import React from "https://esm.sh/react@18.3.1";
import { renderAsync } from "https://esm.sh/@react-email/components@0.0.22";
import { BookingConfirmationEmail } from "./_templates/booking-confirmation.tsx";
import { PaymentReceiptEmail } from "./_templates/payment-receipt.tsx";
import { BookingCancellationEmail } from "./_templates/booking-cancellation.tsx";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  to: string;
  template: 'booking-confirmation' | 'payment-receipt' | 'booking-cancellation' | 'test';
  data?: Record<string, any>;
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

async function sendViaHostinger(config: NonNullable<EmailConfig['hostinger']>, to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
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

    await client.send({
      from: `${config.fromName} <${config.fromEmail}>`,
      to,
      subject,
      html,
      replyTo: config.replyTo,
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

async function sendViaResend(config: NonNullable<EmailConfig['resend']>, to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = new Resend(config.apiKey);

    const { data, error } = await resend.emails.send({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: [to],
      subject,
      html,
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

    const { to, template, data = {} }: SendEmailRequest = await req.json();

    if (!to || !template) {
      throw new Error('Missing required fields: to and template');
    }

    // Load email configuration
    const emailConfig = await loadEmailConfig(supabaseClient);

    // Determine which provider to use
    let providerToUse: 'hostinger' | 'resend' | null = null;
    
    if (emailConfig.provider === 'hostinger' && emailConfig.hostinger?.enabled) {
      providerToUse = 'hostinger';
    } else if (emailConfig.provider === 'resend' && emailConfig.resend?.enabled) {
      providerToUse = 'resend';
    } else if (emailConfig.hostinger?.enabled) {
      providerToUse = 'hostinger';
    } else if (emailConfig.resend?.enabled) {
      providerToUse = 'resend';
    }

    if (!providerToUse) {
      console.warn('Email not sent — No email provider configured');
      return new Response(
        JSON.stringify({
          error: 'Email service not configured. Please configure an email provider in Settings → Email Configuration.',
          configured: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      );
    }

    // Render email template
    let html: string;
    let subject: string;

    switch (template) {
      case 'booking-confirmation':
        html = await renderAsync(React.createElement(BookingConfirmationEmail, data));
        subject = `Booking Confirmation #${data.bookingId || 'N/A'}`;
        break;

      case 'payment-receipt':
        html = await renderAsync(React.createElement(PaymentReceiptEmail, data));
        subject = `Payment Receipt #${data.bookingId || 'N/A'}`;
        break;

      case 'booking-cancellation':
        html = await renderAsync(React.createElement(BookingCancellationEmail, data));
        subject = `Booking Cancellation #${data.bookingId || 'N/A'}`;
        break;

      case 'test':
        html = `
          <h2>Test Email from Jungle Resort PingPe</h2>
          <p>Your email service is configured correctly!</p>
          <p>This is a test message to verify your email integration.</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            Sent from Jungle Resort PingPe<br />
            Vidijaweg 25, Wanica, Suriname<br />
            +597 8858525
          </p>
        `;
        subject = 'Test Email - Configuration Verified';
        break;

      default:
        throw new Error(`Unknown email template: ${template}`);
    }

    // Send email using selected provider
    let result;
    if (providerToUse === 'hostinger') {
      result = await sendViaHostinger(emailConfig.hostinger!, to, subject, html);
    } else {
      result = await sendViaResend(emailConfig.resend!, to, subject, html);
    }

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email sent successfully via', providerToUse, ':', result.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: result.messageId,
        provider: providerToUse,
        template,
        to,
        message: 'Email sent successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in send-email function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to send email',
        configured: error.message?.includes('not configured') ? false : true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    );
  }
});
