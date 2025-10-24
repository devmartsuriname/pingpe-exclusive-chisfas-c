import { PaymentProvider, PaymentIntent, PaymentResult } from "./interface.ts";

/**
 * PayPal Payment Provider
 * Handles PayPal order creation and capture
 */
export class PayPalProvider extends PaymentProvider {
  private async getAccessToken(): Promise<string> {
    const auth = btoa(`${this.config.client_id}:${this.config.client_secret}`);
    const baseUrl = this.config.mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json();
    return data.access_token;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    bookingId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    try {
      const accessToken = await this.getAccessToken();
      const baseUrl = this.config.mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

      const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: bookingId,
              amount: {
                currency_code: currency,
                value: amount.toFixed(2),
              },
              description: `PingPe Booking - ${bookingId}`,
            },
          ],
          application_context: {
            brand_name: 'PingPe',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create PayPal order');
      }

      const order = await response.json();
      console.log('[PayPalProvider] Created order:', order.id);

      return {
        success: true,
        payment_intent_id: order.id,
        client_secret: order.id, // PayPal uses order ID
      };
    } catch (error: any) {
      console.error('[PayPalProvider] Create payment intent error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create PayPal payment',
      };
    }
  }

  async confirmPayment(
    paymentIntentId: string,
    metadata?: Record<string, any>
  ): Promise<PaymentResult> {
    try {
      const accessToken = await this.getAccessToken();
      const baseUrl = this.config.mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

      const response = await fetch(`${baseUrl}/v2/checkout/orders/${paymentIntentId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to capture PayPal order');
      }

      const result = await response.json();
      console.log('[PayPalProvider] Captured order:', result.id);

      return {
        success: true,
        payment_intent_id: result.id,
      };
    } catch (error: any) {
      console.error('[PayPalProvider] Confirm payment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to confirm PayPal payment',
      };
    }
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentIntent> {
    try {
      const accessToken = await this.getAccessToken();
      const baseUrl = this.config.mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

      const response = await fetch(`${baseUrl}/v2/checkout/orders/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get PayPal order status');
      }

      const order = await response.json();
      const status = order.status === 'COMPLETED' ? 'succeeded' : 'pending';

      return {
        id: order.id,
        amount: parseFloat(order.purchase_units[0]?.amount?.value || '0'),
        currency: order.purchase_units[0]?.amount?.currency_code || 'EUR',
        booking_id: order.purchase_units[0]?.reference_id || '',
        status,
      };
    } catch (error: any) {
      console.error('[PayPalProvider] Get payment status error:', error);
      throw error;
    }
  }

  getProviderName(): string {
    return 'PayPal';
  }

  requiresManualReview(): boolean {
    return false;
  }
}
