import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";

interface PayPalButtonProps {
  bookingId: string;
  amount: number;
  currency: string;
  clientId: string;
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalButton({ 
  bookingId, 
  amount, 
  currency, 
  clientId, 
  onSuccess,
  onError 
}: PayPalButtonProps) {
  const { toast } = useToast();
  const paypalRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current || !clientId) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
    script.async = true;
    
    script.onload = () => {
      scriptLoaded.current = true;
      renderPayPalButton();
    };

    script.onerror = () => {
      toast({
        title: "PayPal Error",
        description: "Failed to load PayPal SDK",
        variant: "destructive",
      });
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [clientId, currency]);

  const renderPayPalButton = () => {
    if (!window.paypal || !paypalRef.current) return;

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          // Call create-payment-intent-v2 edge function
          const { data, error } = await supabase.functions.invoke('create-payment-intent-v2', {
            body: {
              booking_id: bookingId,
              amount,
              currency,
            },
          });

          if (error) throw error;
          
          return data.payment_intent_id;
        } catch (error: any) {
          console.error('Create order error:', error);
          toast({
            title: "Payment Error",
            description: error.message || "Failed to create PayPal order",
            variant: "destructive",
          });
          throw error;
        }
      },
      onApprove: async (data: any) => {
        try {
          // Call confirm-payment-v2 edge function
          const { error } = await supabase.functions.invoke('confirm-payment-v2', {
            body: {
              payment_intent_id: data.orderID,
              booking_id: bookingId,
            },
          });

          if (error) throw error;

          toast({
            title: "Payment Successful!",
            description: "Your booking has been confirmed",
          });

          onSuccess();
        } catch (error: any) {
          console.error('Approve error:', error);
          toast({
            title: "Payment Error",
            description: error.message || "Failed to confirm payment",
            variant: "destructive",
          });
          onError?.(error);
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        toast({
          title: "PayPal Error",
          description: "An error occurred with PayPal. Please try again.",
          variant: "destructive",
        });
        onError?.(err);
      },
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal',
      },
    }).render(paypalRef.current);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay with PayPal</CardTitle>
        <CardDescription>
          Complete your payment securely with PayPal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Amount: {currency} {amount.toFixed(2)}
          </AlertDescription>
        </Alert>

        <div ref={paypalRef} className="min-h-[150px] flex items-center justify-center">
          {!scriptLoaded.current && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading PayPal...</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          You will be redirected to PayPal to complete your payment securely
        </p>
      </CardContent>
    </Card>
  );
}
