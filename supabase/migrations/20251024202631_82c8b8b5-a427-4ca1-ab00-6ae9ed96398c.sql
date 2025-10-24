-- Add payment review fields to bookings table
ALTER TABLE public.bookings 
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS reviewed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS review_notes text;

-- Insert payment provider settings
INSERT INTO public.settings (key, value, description) VALUES
  ('payment_primary_provider', '"wise"', 'Primary Payment Provider (wise, paypal, or stripe)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_wise_enabled', 'false', 'Enable Wise Payments')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_wise_api_key', '""', 'Wise API Key (optional)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_wise_account_id', '""', 'Wise Bank Account Number')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_wise_currency', '"EUR"', 'Wise Default Currency')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_paypal_enabled', 'false', 'Enable PayPal Payments')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_paypal_client_id', '""', 'PayPal Client ID')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_paypal_client_secret', '""', 'PayPal Client Secret')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_paypal_mode', '"sandbox"', 'PayPal Mode (sandbox or live)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_stripe_enabled', 'false', 'Enable Stripe Payments')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_stripe_secret_key', '""', 'Stripe Secret Key')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('payment_stripe_publishable_key', '""', 'Stripe Publishable Key')
ON CONFLICT (key) DO NOTHING;