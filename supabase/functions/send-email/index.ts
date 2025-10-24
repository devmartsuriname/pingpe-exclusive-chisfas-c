import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import React from "https://esm.sh/react@18.3.1";
import { renderAsync } from "https://esm.sh/@react-email/components@0.0.22";
import { BookingConfirmationEmail } from "./_templates/booking-confirmation.tsx";
import { PaymentReceiptEmail } from "./_templates/payment-receipt.tsx";
import { BookingCancellationEmail } from "./_templates/booking-cancellation.tsx";
import { EmailProviderRegistry } from "./_lib/provider-registry.ts";

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

    // Load email configuration from settings
    const emailConfig = await EmailProviderRegistry.loadConfigFromSettings(supabaseClient);
    
    // Get email provider
    const emailProvider = EmailProviderRegistry.getProvider(emailConfig);

    if (!emailProvider) {
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

    // Send email via configured provider
    const result = await emailProvider.sendEmail({
      to,
      subject,
      html,
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    console.log('Email sent successfully via', emailConfig.provider, ':', result.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: result.messageId,
        provider: emailConfig.provider,
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
