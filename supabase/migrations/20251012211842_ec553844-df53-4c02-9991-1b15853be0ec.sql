-- Create media_library table
CREATE TABLE public.media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  alt_text TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  folder TEXT DEFAULT 'root',
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_media_library_folder ON public.media_library(folder);
CREATE INDEX idx_media_library_tags ON public.media_library USING GIN(tags);
CREATE INDEX idx_media_library_uploaded_by ON public.media_library(uploaded_by);
CREATE INDEX idx_media_library_file_type ON public.media_library(file_type);

-- Enable Row Level Security
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media_library
CREATE POLICY "Media files are viewable by everyone"
ON public.media_library FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can upload media"
ON public.media_library FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own media"
ON public.media_library FOR UPDATE
USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own media"
ON public.media_library FOR DELETE
USING (uploaded_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
CREATE TRIGGER update_media_library_updated_at
BEFORE UPDATE ON public.media_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for media library
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media_library',
  'media_library',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media_library bucket
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'media_library');

CREATE POLICY "Authenticated users can upload to media library"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media_library' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own media files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'media_library'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own media files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media_library'
  AND auth.uid()::text = (storage.foldername(name))[1]
);