import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReviewPaymentRequest {
  booking_id: string;
  action: 'approve' | 'reject';
  notes?: string;
}

/**
 * Admin Payment Review Handler
 * Allows admins to approve or reject manual payments (Wise, bank transfers)
 */
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

    // Verify user is admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user has admin role
    const { data: roles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some((r: any) => r.role === 'admin');
    if (!isAdmin) {
      throw new Error('Forbidden: Admin access required');
    }

    const { booking_id, action, notes = '' }: ReviewPaymentRequest = await req.json();

    if (!booking_id || !action) {
      throw new Error('Missing required fields: booking_id and action');
    }

    // Get booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    console.log(`[admin-review-payment] ${action} payment for booking ${booking_id}`);

    if (action === 'approve') {
      // Approve payment
      const { error: updateError } = await supabaseClient
        .from('bookings')
        .update({
          payment_status: 'succeeded',
          payment_completed_at: new Date().toISOString(),
          status: 'confirmed',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes,
        })
        .eq('id', booking_id);

      if (updateError) {
        throw new Error('Failed to approve payment');
      }

      // Create payment record
      const { error: paymentError } = await supabaseClient
        .from('payments')
        .insert({
          booking_id,
          amount: booking.total_price,
          payment_status: 'completed',
          payment_method: booking.payment_provider || 'bank_transfer',
        });

      if (paymentError) {
        console.error('Failed to create payment record:', paymentError);
      }

      console.log(`[admin-review-payment] Payment approved for booking ${booking_id}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment approved successfully',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (action === 'reject') {
      // Reject payment
      const { error: updateError } = await supabaseClient
        .from('bookings')
        .update({
          payment_status: 'failed',
          status: 'cancelled',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: notes,
        })
        .eq('id', booking_id);

      if (updateError) {
        throw new Error('Failed to reject payment');
      }

      console.log(`[admin-review-payment] Payment rejected for booking ${booking_id}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment rejected',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    throw new Error('Invalid action');
  } catch (error: any) {
    console.error('[admin-review-payment] Error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to review payment',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' || error.message?.includes('Forbidden') ? 403 : 400,
      }
    );
  }
});
