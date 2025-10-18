import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreatePaymentIntentParams {
  bookingId: string;
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  status: string;
}

interface ConfirmPaymentParams {
  paymentIntentId: string;
  bookingId: string;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const createPaymentIntent = async ({
    bookingId,
    amount,
    currency = "usd",
    metadata = {},
  }: CreatePaymentIntentParams): Promise<PaymentIntentResponse | null> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          bookingId,
          amount,
          currency,
          metadata,
        },
      });

      if (error) throw error;

      if (data.error) {
        // Check if Stripe is not configured
        if (!data.configured) {
          toast({
            title: "Payment Unavailable",
            description: "Stripe is not configured. Please contact the administrator to enable payments.",
            variant: "destructive",
          });
          return null;
        }
        throw new Error(data.error);
      }

      console.log('Payment intent created:', data.paymentIntentId);
      return data as PaymentIntentResponse;
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async ({
    paymentIntentId,
    bookingId,
  }: ConfirmPaymentParams): Promise<boolean> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('confirm-payment', {
        body: {
          paymentIntentId,
          bookingId,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.success && data.paymentStatus === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed!",
        });
        return true;
      }

      if (data.paymentStatus === 'processing') {
        toast({
          title: "Payment Processing",
          description: "Your payment is being processed. You will receive a confirmation shortly.",
        });
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error confirming payment:', error);
      toast({
        title: "Payment Confirmation Failed",
        description: error.message || "Failed to confirm payment. Please contact support.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentStatus = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('payment_status, payment_intent_id, payment_method, payment_completed_at')
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return null;
    }
  };

  return {
    createPaymentIntent,
    confirmPayment,
    getPaymentStatus,
    isProcessing,
  };
};
