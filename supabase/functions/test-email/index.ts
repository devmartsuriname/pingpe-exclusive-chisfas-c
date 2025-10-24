import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { EmailProviderRegistry } from "../send-email/_lib/provider-registry.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  to: string;
  provider?: 'hostinger' | 'resend';
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

    // Load email configuration
    const emailConfig = await EmailProviderRegistry.loadConfigFromSettings(supabaseClient);

    // Override provider if specified
    if (provider) {
      emailConfig.provider = provider;
    }

    const emailProvider = EmailProviderRegistry.getProvider(emailConfig);

    if (!emailProvider) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `${provider || emailConfig.provider} provider is not configured or disabled`,
          configured: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      );
    }

    // Test connection first
    const connectionOk = await emailProvider.testConnection();
    if (!connectionOk) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Connection test failed. Please verify your configuration.',
          configured: true,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Send test email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">🎉 Email Configuration Test</h2>
        <p style="color: #666; line-height: 1.6;">
          Congratulations! Your email service is configured correctly and working.
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Provider:</strong> ${emailConfig.provider}</p>
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

    const result = await emailProvider.sendEmail({
      to,
      subject: `Test Email - ${emailConfig.provider.charAt(0).toUpperCase() + emailConfig.provider.slice(1)} Configuration`,
      html,
    });

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error || 'Failed to send test email',
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
        provider: emailConfig.provider,
        messageId: result.messageId,
        to,
        message: 'Test email sent successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
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
