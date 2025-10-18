-- Add WebP and AVIF URLs and srcset support to media_library table
ALTER TABLE media_library 
ADD COLUMN IF NOT EXISTS webp_url TEXT,
ADD COLUMN IF NOT EXISTS avif_url TEXT,
ADD COLUMN IF NOT EXISTS srcset JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain the new columns
COMMENT ON COLUMN media_library.webp_url IS 'URL to WebP optimized version of the image';
COMMENT ON COLUMN media_library.avif_url IS 'URL to AVIF optimized version of the image (future use)';
COMMENT ON COLUMN media_library.srcset IS 'JSON object containing srcset data for responsive images';
