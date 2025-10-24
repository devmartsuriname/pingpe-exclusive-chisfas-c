/**
 * Payment Provider Interface
 * Defines the contract for all payment providers (Wise, PayPal, Stripe)
 */

export interface PaymentConfig {
  provider: 'wise' | 'paypal' | 'stripe';
  wise?: {
    enabled: boolean;
    api_key: string;
    account_id: string;
    currency: string;
  };
  paypal?: {
    enabled: boolean;
    client_id: string;
    client_secret: string;
    mode: 'sandbox' | 'live';
  };
  stripe?: {
    enabled: boolean;
    secret_key: string;
    publishable_key: string;
  };
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  booking_id: string;
  status: 'pending' | 'requires_action' | 'succeeded' | 'failed';
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  payment_intent_id?: string;
  client_secret?: string;
  instructions?: string; // For manual payment methods like Wise
  error?: string;
  requires_manual_review?: boolean;
}

export abstract class PaymentProvider {
  protected config: any;

  constructor(config: any) {
    this.config = config;
  }

  /**
   * Create a payment intent
   */
  abstract createPaymentIntent(
    amount: number,
    currency: string,
    bookingId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult>;

  /**
   * Confirm/capture a payment
   */
  abstract confirmPayment(
    paymentIntentId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult>;

  /**
   * Get payment status
   */
  abstract getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent>;

  /**
   * Get the provider name
   */
  abstract getProviderName(): string;

  /**
   * Whether this provider requires manual review
   */
  abstract requiresManualReview(): boolean;
}
