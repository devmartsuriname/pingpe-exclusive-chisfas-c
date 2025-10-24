import { PaymentProvider, PaymentIntent, PaymentResult } from "./interface.ts";

/**
 * Wise Payment Provider
 * Handles manual bank transfer instructions for Wise
 */
export class WiseProvider extends PaymentProvider {
  async createPaymentIntent(
    amount: number,
    currency: string,
    bookingId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    try {
      // Wise uses manual bank transfers, so we generate payment instructions
      const paymentIntentId = `wise_${Date.now()}_${bookingId.substring(0, 8)}`;

      const instructions = this.generatePaymentInstructions(amount, currency, bookingId);

      console.log('[WiseProvider] Created payment intent:', paymentIntentId);

      return {
        success: true,
        payment_intent_id: paymentIntentId,
        instructions,
        requires_manual_review: true,
      };
    } catch (error: any) {
      console.error('[WiseProvider] Create payment intent error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create Wise payment intent',
      };
    }
  }

  async confirmPayment(
    paymentIntentId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    // Wise payments are confirmed manually by admin after proof upload
    return {
      success: true,
      payment_intent_id: paymentIntentId,
      requires_manual_review: true,
    };
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    // Since Wise is manual, we return pending status
    // Actual status is tracked in bookings table
    return {
      id: paymentIntentId,
      amount: 0,
      currency: this.config.currency || 'EUR',
      booking_id: '',
      status: 'pending',
    };
  }

  getProviderName(): string {
    return 'Wise';
  }

  requiresManualReview(): boolean {
    return true;
  }

  private generatePaymentInstructions(
    amount: number,
    currency: string,
    bookingId: string
  ): string {
    return `
**Payment Instructions - Wise Bank Transfer**

Please transfer exactly **${currency} ${amount.toFixed(2)}** to:

**Bank Account Details:**
- Account Name: PingPe Suriname
- Account Number: ${this.config.account_id || 'XXXX-XXXX-XXXX'}
- Currency: ${currency}
- Reference: ${bookingId}

**Important:**
1. Use "${bookingId}" as the payment reference
2. Upload proof of payment after transfer
3. Your booking will be confirmed once payment is verified (1-2 business days)

For questions, contact us at info@pingpe.com
    `.trim();
  }
}
