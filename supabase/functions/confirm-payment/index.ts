import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmPaymentRequest {
  paymentIntentId: string;
  bookingId: string;
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

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body
    const { paymentIntentId, bookingId }: ConfirmPaymentRequest = await req.json();

    if (!paymentIntentId || !bookingId) {
      throw new Error('Missing required fields: paymentIntentId and bookingId');
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, guest_id, payment_intent_id, payment_status, status')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    if (booking.guest_id !== user.id) {
      throw new Error('Unauthorized: Booking does not belong to user');
    }

    if (booking.payment_intent_id !== paymentIntentId) {
      throw new Error('Payment intent does not match booking');
    }

    // Get Stripe secret key from settings
    const { data: stripeSetting } = await supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'stripe_secret_key')
      .single();

    if (!stripeSetting?.value) {
      throw new Error('Stripe is not configured. Please contact administrator.');
    }

    // RETRIEVE PAYMENT INTENT FROM STRIPE
    const stripeApiUrl = `https://api.stripe.com/v1/payment_intents/${paymentIntentId}`;
    
    const stripeResponse = await fetch(stripeApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${stripeSetting.value}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.json();
      console.error('Stripe API Error:', errorData);
      throw new Error(`Stripe API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const paymentIntent = await stripeResponse.json();

    // Determine payment status and booking status
    let paymentStatus = 'processing';
    let bookingStatus = booking.status;
    let paymentMethod = null;
    let paymentCompletedAt = null;

    if (paymentIntent.status === 'succeeded') {
      paymentStatus = 'succeeded';
      bookingStatus = 'confirmed';
      paymentMethod = paymentIntent.payment_method_types?.[0] || 'card';
      paymentCompletedAt = new Date().toISOString();
    } else if (paymentIntent.status === 'processing') {
      paymentStatus = 'processing';
    } else if (paymentIntent.status === 'requires_payment_method' || paymentIntent.status === 'canceled') {
      paymentStatus = 'failed';
    }

    // Update booking with payment confirmation
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        payment_status: paymentStatus,
        payment_method: paymentMethod,
        payment_completed_at: paymentCompletedAt,
        status: bookingStatus,
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      throw new Error('Failed to update booking status');
    }

    // If payment succeeded, create payment record
    if (paymentStatus === 'succeeded') {
      const { error: paymentError } = await supabaseClient
        .from('payments')
        .insert({
          booking_id: bookingId,
          amount: paymentIntent.amount / 100, // Convert from cents
          payment_status: 'completed',
          payment_method: paymentMethod,
          stripe_payment_id: paymentIntentId,
        });

      if (paymentError) {
        console.error('Failed to create payment record:', paymentError);
      }

      console.log('Payment confirmed and booking updated:', bookingId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentStatus,
        bookingStatus,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to confirm payment',
        configured: error.message?.includes('not configured') ? false : true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    );
  }
});
