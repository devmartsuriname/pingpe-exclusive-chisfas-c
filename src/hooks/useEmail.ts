import { supabase } from "@/integrations/supabase/client";

interface SendEmailParams {
  to: string;
  template: 'booking-confirmation' | 'payment-receipt' | 'booking-cancellation' | 'test';
  data?: Record<string, any>;
}

export const useEmail = () => {
  const sendEmail = async ({ to, template, data = {} }: SendEmailParams): Promise<boolean> => {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email-v2', {
        body: {
          to,
          template,
          data,
        },
      });

      if (error) {
        console.error('Email send error:', error);
        return false;
      }

      if (result?.error) {
        // Email service not configured - log warning but don't fail
        if (!result.configured) {
          console.warn('Email not sent — Hostinger SMTP not configured. Configure via Admin Settings.');
          return false;
        }
        console.error('Email send failed:', result.error);
        return false;
      }

      console.log('Email sent successfully:', result.emailId);
      return true;
    } catch (error) {
      console.error('Unexpected error sending email:', error);
      return false;
    }
  };

  const sendBookingConfirmation = async (params: {
    to: string;
    userName: string;
    bookingId: string;
    propertyTitle: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    totalAmount: number;
    currency?: string;
  }) => {
    return sendEmail({
      to: params.to,
      template: 'booking-confirmation',
      data: params,
    });
  };

  const sendPaymentReceipt = async (params: {
    to: string;
    userName: string;
    bookingId: string;
    propertyTitle: string;
    paymentAmount: number;
    paymentMethod: string;
    paymentDate: string;
    currency?: string;
    transactionId: string;
  }) => {
    return sendEmail({
      to: params.to,
      template: 'payment-receipt',
      data: params,
    });
  };

  const sendBookingCancellation = async (params: {
    to: string;
    userName: string;
    bookingId: string;
    propertyTitle: string;
    checkInDate: string;
    checkOutDate: string;
    cancellationDate: string;
    refundAmount: number;
    currency?: string;
    reason?: string;
  }) => {
    return sendEmail({
      to: params.to,
      template: 'booking-cancellation',
      data: params,
    });
  };

  return {
    sendEmail,
    sendBookingConfirmation,
    sendPaymentReceipt,
    sendBookingCancellation,
  };
};
