import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { getEmailProvider } from "../_shared/email-providers/registry.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  to: string;
  template: string;
  data?: Record<string, any>;
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

    const { to, template, data = {} }: SendEmailRequest = await req.json();

    if (!to || !template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, template' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[send-email-v2] Sending ${template} to ${to}`);

    // Get the active email provider
    const provider = await getEmailProvider(supabaseClient);

    // Render email template
    let subject = 'PingPe Notification';
    let html = '';

    switch (template) {
      case 'test':
        subject = 'Test Email from PingPe';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">✅ Email Configuration Working!</h1>
            <p>This is a test email from PingPe.</p>
            <p>Provider: <strong>${provider.getProviderName()}</strong></p>
            <p>Sent at: ${new Date().toISOString()}</p>
          </div>
        `;
        break;

      case 'booking-confirmation':
        subject = `Booking Confirmation - ${data.booking_id || 'N/A'}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">🎉 Booking Confirmed!</h1>
            <p>Dear ${data.guest_name || 'Guest'},</p>
            <p>Your booking has been confirmed.</p>
            <p><strong>Booking ID:</strong> ${data.booking_id || 'N/A'}</p>
            <p><strong>Check-in:</strong> ${data.check_in || 'N/A'}</p>
            <p><strong>Check-out:</strong> ${data.check_out || 'N/A'}</p>
            <p>We look forward to hosting you!</p>
          </div>
        `;
        break;

      case 'payment-receipt':
        subject = `Payment Receipt - ${data.booking_id || 'N/A'}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">✅ Payment Received</h1>
            <p>Dear ${data.guest_name || 'Guest'},</p>
            <p>We've received your payment.</p>
            <p><strong>Amount:</strong> €${data.amount || '0.00'}</p>
            <p><strong>Booking ID:</strong> ${data.booking_id || 'N/A'}</p>
            <p>Thank you for your payment!</p>
          </div>
        `;
        break;

      case 'booking-cancellation':
        subject = `Booking Cancelled - ${data.booking_id || 'N/A'}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">❌ Booking Cancelled</h1>
            <p>Dear ${data.guest_name || 'Guest'},</p>
            <p>Your booking has been cancelled.</p>
            <p><strong>Booking ID:</strong> ${data.booking_id || 'N/A'}</p>
            <p>If you have any questions, please contact us.</p>
          </div>
        `;
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown template: ${template}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Send email using the provider
    const result = await provider.send({ to, subject, html });

    if (!result.success) {
      console.error('[send-email-v2] Failed to send email:', result.error);
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[send-email-v2] Email sent successfully: ${result.messageId}`);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        provider: provider.getProviderName(),
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[send-email-v2] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
