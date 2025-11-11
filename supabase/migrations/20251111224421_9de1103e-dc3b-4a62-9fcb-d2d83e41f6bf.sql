-- Migration: Clean up Resend email provider settings
-- Date: 2025-11-11
-- Description: Remove all Resend-related settings keys and ensure Hostinger is the default provider

-- Remove Resend-related settings
DELETE FROM settings WHERE key IN (
  'email_provider',
  'email_resend_enabled',
  'email_resend_api_key',
  'email_resend_from_email',
  'email_resend_from_name',
  'resend_api_key',
  'resend_sender_email',
  'resend_sender_name'
);

-- Ensure all Hostinger settings keys exist (if not already present)
-- This ensures clean state for email configuration
INSERT INTO settings (key, value, description)
VALUES 
  ('email_hostinger_enabled', 'false', 'Enable Hostinger SMTP for email delivery'),
  ('email_hostinger_host', '"smtp.hostinger.com"', 'Hostinger SMTP host'),
  ('email_hostinger_port', '465', 'Hostinger SMTP port (465 for SSL, 587 for TLS)'),
  ('email_hostinger_username', '""', 'Hostinger SMTP username (full email address)'),
  ('email_hostinger_password', '""', 'Hostinger SMTP password (encrypted)'),
  ('email_hostinger_from_email', '""', 'Hostinger sender email address'),
  ('email_hostinger_from_name', '"PingPe"', 'Hostinger sender name')
ON CONFLICT (key) DO NOTHING;