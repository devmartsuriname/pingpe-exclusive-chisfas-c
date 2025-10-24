import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Payment Webhook Handler
 * Receives webhooks from PayPal, Stripe, etc. to confirm payments
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const provider = req.headers.get('x-payment-provider') || 'unknown';
    const payload = await req.json();

    console.log(`[payment-webhook] Received webhook from ${provider}`);

    // Handle PayPal webhooks
    if (provider === 'paypal') {
      return await handlePayPalWebhook(supabaseClient, payload);
    }

    // Handle Stripe webhooks
    if (provider === 'stripe') {
      return await handleStripeWebhook(supabaseClient, payload);
    }

    return new Response(
      JSON.stringify({ error: 'Unknown payment provider' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  } catch (error: any) {
    console.error('[payment-webhook] Error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function handlePayPalWebhook(supabaseClient: any, payload: any) {
  const eventType = payload.event_type;
  
  if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
    const orderId = payload.resource.id;
    const referenceId = payload.resource.purchase_units?.[0]?.reference_id;

    if (referenceId) {
      await supabaseClient
        .from('bookings')
        .update({
          payment_status: 'succeeded',
          payment_completed_at: new Date().toISOString(),
          status: 'confirmed',
        })
        .eq('id', referenceId)
        .eq('payment_intent_id', orderId);

      console.log(`[payment-webhook] PayPal payment confirmed for booking ${referenceId}`);
    }
  }

  return new Response(
    JSON.stringify({ received: true }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

async function handleStripeWebhook(supabaseClient: any, payload: any) {
  const eventType = payload.type;

  if (eventType === 'payment_intent.succeeded') {
    const paymentIntent = payload.data.object;
    const bookingId = paymentIntent.metadata?.booking_id;

    if (bookingId) {
      await supabaseClient
        .from('bookings')
        .update({
          payment_status: 'succeeded',
          payment_completed_at: new Date().toISOString(),
          status: 'confirmed',
        })
        .eq('id', bookingId);

      console.log(`[payment-webhook] Stripe payment confirmed for booking ${bookingId}`);
    }
  }

  return new Response(
    JSON.stringify({ received: true }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}
