import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication (optional for system-triggered emails)
    const authHeader = req.headers.get('Authorization');
    let user = null;
    if (authHeader) {
      const { data: { user: authUser } } = await supabaseClient.auth.getUser();
      user = authUser;
    }

    // Parse request body
    const { to, template, data = {} }: SendEmailRequest = await req.json();

    // Validate required fields
    if (!to || !template) {
      throw new Error('Missing required fields: to and template');
    }

    // Get Resend configuration from settings
    const { data: resendSettings, error: settingsError } = await supabaseClient
      .from('settings')
      .select('key, value')
      .in('key', ['resend_api_key', 'resend_sender_email', 'resend_sender_name']);

    if (settingsError) {
      console.error('Failed to fetch Resend settings:', settingsError);
    }

    const resendApiKey = resendSettings?.find((s: any) => s.key === 'resend_api_key')?.value;
    const senderEmail = resendSettings?.find((s: any) => s.key === 'resend_sender_email')?.value || 'noreply@jungleresortpingpe.com';
    const senderName = resendSettings?.find((s: any) => s.key === 'resend_sender_name')?.value || 'Jungle Resort PingPe';

    // Check if Resend is configured
    if (!resendApiKey) {
      console.warn('Email not sent — Resend API not configured');
      return new Response(
        JSON.stringify({
          error: 'Email service not configured. Please configure Resend API key in Settings → Integrations.',
          configured: false,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 503,
        }
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(resendApiKey);

    // Render email template
    let html: string;
    let subject: string;

    switch (template) {
      case 'booking-confirmation':
        html = await renderAsync(
          React.createElement(BookingConfirmationEmail, data)
        );
        subject = `Booking Confirmation #${data.bookingId || 'N/A'}`;
        break;

      case 'payment-receipt':
        html = await renderAsync(
          React.createElement(PaymentReceiptEmail, data)
        );
        subject = `Payment Receipt #${data.bookingId || 'N/A'}`;
        break;

      case 'booking-cancellation':
        html = await renderAsync(
          React.createElement(BookingCancellationEmail, data)
        );
        subject = `Booking Cancellation #${data.bookingId || 'N/A'}`;
        break;

      case 'test':
        html = `
          <h2>Test Email from Jungle Resort PingPe</h2>
          <p>Your Resend email service is configured correctly!</p>
          <p>This is a test message to verify your email integration.</p>
          <hr />
          <p style="color: #666; font-size: 12px;">
            Sent from Jungle Resort PingPe<br />
            Vidijaweg 25, Wanica, Suriname<br />
            +597 8858525
          </p>
        `;
        subject = 'Test Email - Resend Configuration';
        break;

      default:
        throw new Error(`Unknown email template: ${template}`);
    }

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: [to],
      subject,
      html,
    });

    if (emailError) {
      console.error('Resend API error:', emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log('Email sent successfully:', emailData?.id);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailData?.id,
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
