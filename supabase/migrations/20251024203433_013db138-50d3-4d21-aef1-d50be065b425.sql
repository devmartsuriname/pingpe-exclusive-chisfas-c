-- Add new columns to experiences table for official PingPe tours
ALTER TABLE public.experiences 
  ADD COLUMN IF NOT EXISTS duration_days integer,
  ADD COLUMN IF NOT EXISTS day_program jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tour_type text,
  ADD COLUMN IF NOT EXISTS keywords text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Flag existing demo tours
UPDATE public.experiences 
SET is_demo = true 
WHERE title ILIKE '%demo%' OR title ILIKE '%sample%';

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_experiences_is_demo ON public.experiences(is_demo);
CREATE INDEX IF NOT EXISTS idx_experiences_tour_type ON public.experiences(tour_type);
CREATE INDEX IF NOT EXISTS idx_experiences_duration_days ON public.experiences(duration_days);

-- Update RLS policy to hide demo content from public
DROP POLICY IF EXISTS "Experiences are viewable by everyone" ON public.experiences;

CREATE POLICY "Experiences are viewable by everyone"
ON public.experiences
FOR SELECT
USING (
  (is_active = true AND is_demo = false) 
  OR host_id = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);