-- Add payment tracking fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id text,
ADD COLUMN IF NOT EXISTS payment_provider text DEFAULT 'stripe',
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_completed_at timestamp with time zone;

-- Add check constraint for payment status
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_payment_status_check 
CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled'));

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent ON public.bookings(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);

COMMENT ON COLUMN public.bookings.payment_status IS 'Current status of payment: pending, processing, succeeded, failed, refunded, cancelled';
COMMENT ON COLUMN public.bookings.payment_intent_id IS 'Stripe PaymentIntent ID for tracking';
COMMENT ON COLUMN public.bookings.payment_provider IS 'Payment provider used (stripe, paypal, etc)';
COMMENT ON COLUMN public.bookings.payment_method IS 'Payment method type (card, wallet, etc)';
COMMENT ON COLUMN public.bookings.payment_completed_at IS 'Timestamp when payment was successfully completed';