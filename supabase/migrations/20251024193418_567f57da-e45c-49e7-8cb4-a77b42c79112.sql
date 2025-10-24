-- Add payment proof and review fields to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS proof_url TEXT,
ADD COLUMN IF NOT EXISTS review_notes TEXT,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Create payment_proofs storage bucket for proof of payment uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for payment_proofs bucket
CREATE POLICY "Users can upload their own payment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment_proofs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment_proofs' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM bookings
      WHERE proof_url = storage.objects.name
      AND (
        guest_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM properties
          WHERE properties.id = bookings.property_id
          AND properties.host_id = auth.uid()
        ) OR
        EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_id = auth.uid() AND role = 'admin'
        )
      )
    )
  )
);

CREATE POLICY "Admins can view all payment proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment_proofs' AND
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Add comment for documentation
COMMENT ON COLUMN bookings.proof_url IS 'Storage path to uploaded payment proof (for manual payment methods like Wise Instructions Mode)';
COMMENT ON COLUMN bookings.review_notes IS 'Admin notes when reviewing payment proof';
COMMENT ON COLUMN bookings.reviewed_by IS 'Admin user who reviewed the payment proof';
COMMENT ON COLUMN bookings.reviewed_at IS 'Timestamp when payment proof was reviewed';