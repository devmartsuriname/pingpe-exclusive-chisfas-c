-- One-time cleanup of duplicate official tours
-- Keep newest entry for each unique title, delete older duplicates

WITH duplicates_to_delete AS (
  SELECT id
  FROM (
    SELECT id, title, created_at,
      ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at DESC) as rn
    FROM experiences
    WHERE is_demo = false
  ) ranked
  WHERE rn > 1
)
DELETE FROM experiences
WHERE id IN (SELECT id FROM duplicates_to_delete);

-- Verify cleanup
DO $$
DECLARE
  tour_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT title) INTO tour_count
  FROM experiences
  WHERE is_demo = false;
  
  RAISE NOTICE 'Cleanup complete. Unique official tours remaining: %', tour_count;
END $$;