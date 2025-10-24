import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { getProviderByName, getEmailProvider } from "../_shared/email-providers/registry.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestEmailRequest {
  to: string;
  provider?: 'hostinger' | 'resend';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const { data: { user }, error } = await supabaseClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );

      if (error || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const { to, provider: requestedProvider }: TestEmailRequest = await req.json();

    if (!to) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: to' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[test-email-v2] Testing email to ${to} with provider: ${requestedProvider || 'default'}`);

    // Get the requested provider or use the active one
    const provider = requestedProvider
      ? await getProviderByName(supabaseClient, requestedProvider)
      : await getEmailProvider(supabaseClient);

    // Test connection first
    const connectionTest = await provider.testConnection();
    if (!connectionTest.success) {
      console.error('[test-email-v2] Connection test failed:', connectionTest.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: connectionTest.error,
          provider: provider.getProviderName(),
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send test email
    const result = await provider.send({
      to,
      subject: `Test Email from PingPe - ${provider.getProviderName()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #16a34a;">✅ Email Configuration Working!</h1>
          <p>This is a test email from PingPe.</p>
          <p><strong>Provider:</strong> ${provider.getProviderName()}</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <hr style="margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            If you received this email, your email configuration is working correctly.
          </p>
        </div>
      `,
    });

    if (!result.success) {
      console.error('[test-email-v2] Failed to send test email:', result.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: result.error,
          provider: provider.getProviderName(),
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[test-email-v2] Test email sent successfully: ${result.messageId}`);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        provider: provider.getProviderName(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[test-email-v2] Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
