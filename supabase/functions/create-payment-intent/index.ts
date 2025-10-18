import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentIntentRequest {
  bookingId: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
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
    const { bookingId, amount, currency = 'usd', metadata = {} }: PaymentIntentRequest = await req.json();

    // Validate required fields
    if (!bookingId || !amount) {
      throw new Error('Missing required fields: bookingId and amount');
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, guest_id, total_price, status')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    if (booking.guest_id !== user.id) {
      throw new Error('Unauthorized: Booking does not belong to user');
    }

    // Check if Stripe keys are configured
    const { data: stripeSettings } = await supabaseClient
      .from('settings')
      .select('key, value')
      .in('key', ['stripe_secret_key', 'stripe_test_mode']);

    const stripeSecretKey = stripeSettings?.find((s: any) => s.key === 'stripe_secret_key')?.value;
    const testMode = stripeSettings?.find((s: any) => s.key === 'stripe_test_mode')?.value ?? true;

    if (!stripeSecretKey) {
      throw new Error('Stripe is not configured. Please contact administrator.');
    }

    // STRIPE PAYMENT INTENT CREATION
    // Initialize Stripe with secret key from settings
    const stripeApiUrl = 'https://api.stripe.com/v1/payment_intents';
    
    const stripeResponse = await fetch(stripeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(), // Convert to cents
        currency: currency,
        'metadata[booking_id]': bookingId,
        'metadata[user_id]': user.id,
        'metadata[test_mode]': testMode.toString(),
        ...Object.entries(metadata).reduce((acc, [key, value]) => ({
          ...acc,
          [`metadata[${key}]`]: value,
        }), {}),
      }),
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.json();
      console.error('Stripe API Error:', errorData);
      throw new Error(`Stripe API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const paymentIntent = await stripeResponse.json();

    // Update booking with payment intent ID
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        payment_intent_id: paymentIntent.id,
        payment_status: 'processing',
        payment_provider: 'stripe',
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
    }

    console.log('Payment intent created:', paymentIntent.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create payment intent',
        configured: error.message?.includes('not configured') ? false : true,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    );
  }
});
