-- Seed email provider settings
INSERT INTO public.settings (key, value, description) VALUES
  ('email_provider', '"hostinger"', 'Primary Email Provider (hostinger or resend)')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_hostinger_enabled', 'false', 'Enable Hostinger SMTP')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_hostinger_host', '""', 'Hostinger SMTP Host')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_hostinger_port', '465', 'Hostinger SMTP Port')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_hostinger_username', '""', 'Hostinger SMTP Username')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_hostinger_password', '""', 'Hostinger SMTP Password')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_hostinger_from_email', '""', 'Hostinger From Email Address')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_hostinger_from_name', '"PingPe"', 'Hostinger From Name')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_resend_enabled', 'false', 'Enable Resend API')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_resend_api_key', '""', 'Resend API Key')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_resend_from_email', '""', 'Resend From Email Address')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description) VALUES
  ('email_resend_from_name', '"PingPe"', 'Resend From Name')
ON CONFLICT (key) DO NOTHING;