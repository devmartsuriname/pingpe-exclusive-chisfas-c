-- Create storage bucket for inventory images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'inventory_images', 
  'inventory_images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Public can view inventory images
DO $$
BEGIN
  CREATE POLICY "Public can view inventory images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'inventory_images');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Policy: Admins and hosts can upload images
DO $$
BEGIN
  CREATE POLICY "Admins and hosts can upload inventory images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'inventory_images' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'host'::app_role))
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Policy: Admins and hosts can update their images
DO $$
BEGIN
  CREATE POLICY "Admins and hosts can update inventory images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'inventory_images' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'host'::app_role))
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Policy: Admins and hosts can delete their images
DO $$
BEGIN
  CREATE POLICY "Admins and hosts can delete inventory images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'inventory_images' AND
    (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'host'::app_role))
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;