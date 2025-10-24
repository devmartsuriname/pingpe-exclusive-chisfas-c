-- Create payment_proofs storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload payment proofs for their bookings" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete payment proofs" ON storage.objects;

-- Create RLS policies for payment_proofs bucket

-- Users can upload their own payment proofs
CREATE POLICY "Users upload payment proofs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'payment_proofs' AND
  (storage.foldername(name))[1] IN (
    SELECT id::text FROM bookings WHERE guest_id = auth.uid()
  )
);

-- Users can view their own payment proofs
CREATE POLICY "Users view own payment proofs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment_proofs' AND
  (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM bookings WHERE guest_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- Admins can delete payment proofs
CREATE POLICY "Admins delete payment proofs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'payment_proofs' AND
  EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  )
);