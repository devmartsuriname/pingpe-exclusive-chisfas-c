-- SECURITY FIX: Restrict profile access to authenticated users only
-- This prevents unauthenticated scraping of user data (names, phone numbers, etc.)

-- Drop the dangerous "everyone can view" policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy: authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Note: Insert and Update policies remain unchanged - they're already secure
-- Users can insert their own profile: (auth.uid() = user_id)
-- Users can update their own profile: (auth.uid() = user_id)