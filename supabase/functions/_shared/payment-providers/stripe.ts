import { PaymentProvider, PaymentIntent, PaymentResult } from "./interface.ts";

/**
 * Stripe Payment Provider (Stub for future implementation)
 * Currently returns not implemented errors
 */
export class StripeProvider extends PaymentProvider {
  async createPaymentIntent(
    amount: number,
    currency: string,
    bookingId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    console.warn('[StripeProvider] Stripe integration not yet implemented');
    return {
      success: false,
      error: 'Stripe integration is not yet available. Please use Wise or PayPal.',
    };
  }

  async confirmPayment(
    paymentIntentId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    return {
      success: false,
      error: 'Stripe integration is not yet available.',
    };
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    throw new Error('Stripe integration is not yet available.');
  }

  getProviderName(): string {
    return 'Stripe (Coming Soon)';
  }

  requiresManualReview(): boolean {
    return false;
  }
}
