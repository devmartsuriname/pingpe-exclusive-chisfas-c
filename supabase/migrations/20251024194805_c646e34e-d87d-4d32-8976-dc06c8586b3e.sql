-- Add multi-day tour support fields to experiences table
ALTER TABLE experiences 
ADD COLUMN IF NOT EXISTS duration_days INTEGER,
ADD COLUMN IF NOT EXISTS day_program JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tour_type TEXT CHECK (tour_type IN ('standard', 'back-to-basic', 'combination')),
ADD COLUMN IF NOT EXISTS keywords TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS transport_options JSONB DEFAULT '[]'::jsonb;

-- Mark existing demo content
UPDATE experiences 
SET is_demo = true 
WHERE title LIKE '%(Demo)%';

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_experiences_tour_type ON experiences(tour_type);
CREATE INDEX IF NOT EXISTS idx_experiences_duration_days ON experiences(duration_days);
CREATE INDEX IF NOT EXISTS idx_experiences_is_demo ON experiences(is_demo);

-- Comment on new columns
COMMENT ON COLUMN experiences.duration_days IS 'Total tour duration in days';
COMMENT ON COLUMN experiences.day_program IS 'Array of daily activities and schedules in JSON format';
COMMENT ON COLUMN experiences.tour_type IS 'Type of tour: standard, back-to-basic, or combination';
COMMENT ON COLUMN experiences.keywords IS 'SEO keywords for search optimization';
COMMENT ON COLUMN experiences.is_demo IS 'Flag to hide demo content from public view';
COMMENT ON COLUMN experiences.transport_options IS 'Available transport methods and pricing';