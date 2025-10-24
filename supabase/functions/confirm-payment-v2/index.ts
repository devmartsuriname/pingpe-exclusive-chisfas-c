import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { getPaymentProvider } from "../_shared/payment-providers/registry.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConfirmPaymentRequest {
  payment_intent_id: string;
  booking_id: string;
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

    const { payment_intent_id, booking_id, metadata = {} }: ConfirmPaymentRequest = await req.json();

    if (!payment_intent_id || !booking_id) {
      throw new Error('Missing required fields: payment_intent_id and booking_id');
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, guest_id, payment_intent_id, payment_status')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    if (booking.guest_id !== user.id) {
      throw new Error('Unauthorized: Booking does not belong to user');
    }

    if (booking.payment_intent_id !== payment_intent_id) {
      throw new Error('Payment intent does not match booking');
    }

    console.log(`[confirm-payment-v2] Confirming payment for booking ${booking_id}`);

    // Get active payment provider
    const provider = await getPaymentProvider(supabaseClient);

    // Confirm payment using provider
    const result = await provider.confirmPayment(payment_intent_id, metadata);

    if (!result.success) {
      throw new Error(result.error || 'Failed to confirm payment');
    }

    // For manual review providers, don't update status yet
    if (result.requires_manual_review) {
      console.log(`[confirm-payment-v2] Payment requires manual review`);
      
      return new Response(
        JSON.stringify({
          success: true,
          requires_manual_review: true,
          message: 'Payment received. Awaiting admin approval.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // For automatic providers, update booking status
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        payment_status: 'succeeded',
        payment_completed_at: new Date().toISOString(),
        status: 'confirmed',
      })
      .eq('id', booking_id);

    if (updateError) {
      console.error('Failed to update booking:', updateError);
      throw new Error('Failed to update booking status');
    }

    // Create payment record
    const { data: updatedBooking } = await supabaseClient
      .from('bookings')
      .select('total_price')
      .eq('id', booking_id)
      .single();

    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        booking_id,
        amount: updatedBooking?.total_price || 0,
        payment_status: 'completed',
        payment_method: provider.getProviderName().toLowerCase(),
      });

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
    }

    console.log(`[confirm-payment-v2] Payment confirmed for booking ${booking_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        payment_status: 'succeeded',
        booking_status: 'confirmed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('[confirm-payment-v2] Error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to confirm payment',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    );
  }
});
