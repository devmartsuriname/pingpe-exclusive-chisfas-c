import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { getPaymentProvider } from "../_shared/payment-providers/registry.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentIntentRequest {
  booking_id: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
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

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { booking_id, amount, currency = 'EUR', metadata = {} }: PaymentIntentRequest = await req.json();

    if (!booking_id || !amount) {
      throw new Error('Missing required fields: booking_id and amount');
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, guest_id, total_price, status')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    if (booking.guest_id !== user.id) {
      throw new Error('Unauthorized: Booking does not belong to user');
    }

    console.log(`[create-payment-intent-v2] Creating payment intent for booking ${booking_id}`);

    // Get active payment provider
    const provider = await getPaymentProvider(supabaseClient);
    
    // Create payment intent using provider
    const result = await provider.createPaymentIntent(amount, currency, booking_id, metadata);

    if (!result.success) {
      throw new Error(result.error || 'Failed to create payment intent');
    }

    // Update booking with payment intent details
    const updateData: any = {
      payment_intent_id: result.payment_intent_id,
      payment_provider: provider.getProviderName().toLowerCase(),
    };

    if (provider.requiresManualReview()) {
      updateData.payment_status = 'pending';
      updateData.status = 'pending_payment';
    } else {
      updateData.payment_status = 'processing';
      updateData.status = 'processing';
    }

    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update(updateData)
      .eq('id', booking_id);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
    }

    console.log(`[create-payment-intent-v2] Payment intent created: ${result.payment_intent_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        payment_intent_id: result.payment_intent_id,
        client_secret: result.client_secret,
        instructions: result.instructions,
        provider: provider.getProviderName(),
        requires_manual_review: result.requires_manual_review,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('[create-payment-intent-v2] Error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to create payment intent',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    );
  }
});
