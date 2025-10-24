-- Add missing payment settings for PayPal mode
INSERT INTO public.settings (key, value, description) VALUES
  ('payment_paypal_mode', '"sandbox"', 'PayPal Mode (sandbox or live)')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;