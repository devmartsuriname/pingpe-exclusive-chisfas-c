import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { PaymentProvider, PaymentConfig } from "./interface.ts";
import { WiseProvider } from "./wise.ts";
import { PayPalProvider } from "./paypal.ts";
import { StripeProvider } from "./stripe.ts";

/**
 * Load payment configuration from Supabase settings table
 */
export async function loadPaymentConfig(supabaseClient: any): Promise<PaymentConfig> {
  const { data: settings, error } = await supabaseClient
    .from('settings')
    .select('key, value')
    .in('key', [
      'payment_primary_provider',
      'payment_wise_enabled',
      'payment_wise_api_key',
      'payment_wise_account_id',
      'payment_wise_currency',
      'payment_paypal_enabled',
      'payment_paypal_client_id',
      'payment_paypal_client_secret',
      'payment_paypal_mode',
      'payment_stripe_enabled',
      'payment_stripe_secret_key',
      'payment_stripe_publishable_key',
    ]);

  if (error) {
    console.error('[PaymentRegistry] Failed to load payment config:', error);
    throw new Error('Failed to load payment configuration');
  }

  const config: any = {};
  settings?.forEach((setting: any) => {
    config[setting.key] = setting.value;
  });

  const paymentConfig: PaymentConfig = {
    provider: config.payment_primary_provider || 'wise',
    wise: {
      enabled: config.payment_wise_enabled || false,
      api_key: config.payment_wise_api_key || '',
      account_id: config.payment_wise_account_id || '',
      currency: config.payment_wise_currency || 'EUR',
    },
    paypal: {
      enabled: config.payment_paypal_enabled || false,
      client_id: config.payment_paypal_client_id || '',
      client_secret: config.payment_paypal_client_secret || '',
      mode: config.payment_paypal_mode || 'sandbox',
    },
    stripe: {
      enabled: config.payment_stripe_enabled || false,
      secret_key: config.payment_stripe_secret_key || '',
      publishable_key: config.payment_stripe_publishable_key || '',
    },
  };

  return paymentConfig;
}

/**
 * Get the active payment provider instance
 */
export async function getPaymentProvider(supabaseClient: any): Promise<PaymentProvider> {
  const config = await loadPaymentConfig(supabaseClient);

  // Determine which provider to use
  let provider: PaymentProvider;

  if (config.provider === 'paypal' && config.paypal?.enabled && config.paypal.client_id) {
    provider = new PayPalProvider(config.paypal);
    console.log('[PaymentRegistry] Using PayPal provider');
  } else if (config.provider === 'stripe' && config.stripe?.enabled && config.stripe.secret_key) {
    provider = new StripeProvider(config.stripe);
    console.log('[PaymentRegistry] Using Stripe provider');
  } else if (config.wise?.enabled && config.wise.account_id) {
    provider = new WiseProvider(config.wise);
    console.log('[PaymentRegistry] Using Wise provider');
  } else {
    throw new Error('No payment provider is configured and enabled');
  }

  return provider;
}

/**
 * Get a specific provider by name
 */
export async function getProviderByName(
  supabaseClient: any,
  providerName: 'wise' | 'paypal' | 'stripe'
): Promise<PaymentProvider> {
  const config = await loadPaymentConfig(supabaseClient);

  if (providerName === 'paypal') {
    if (!config.paypal?.enabled || !config.paypal.client_id) {
      throw new Error('PayPal is not configured');
    }
    return new PayPalProvider(config.paypal);
  } else if (providerName === 'stripe') {
    if (!config.stripe?.enabled || !config.stripe.secret_key) {
      throw new Error('Stripe is not configured');
    }
    return new StripeProvider(config.stripe);
  } else {
    if (!config.wise?.enabled || !config.wise.account_id) {
      throw new Error('Wise is not configured');
    }
    return new WiseProvider(config.wise);
  }
}
