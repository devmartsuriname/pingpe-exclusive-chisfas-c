-- Phase 2: Create user_contact_info table with strict RLS policies
-- This separates sensitive contact information (phone numbers) from public profile data

-- Create new table for sensitive contact information
CREATE TABLE public.user_contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_contact_info ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own contact info
CREATE POLICY "Users can view their own contact info"
ON public.user_contact_info
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Admins can view all contact info
CREATE POLICY "Admins can view all contact info"
ON public.user_contact_info
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Policy: Users can insert their own contact info
CREATE POLICY "Users can insert their own contact info"
ON public.user_contact_info
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own contact info
CREATE POLICY "Users can update their own contact info"
ON public.user_contact_info
FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Admins can update all contact info
CREATE POLICY "Admins can update all contact info"
ON public.user_contact_info
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_user_contact_info_updated_at
  BEFORE UPDATE ON public.user_contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing phone data from profiles to user_contact_info
INSERT INTO public.user_contact_info (user_id, phone)
SELECT user_id, phone 
FROM public.profiles 
WHERE phone IS NOT NULL AND phone != ''
ON CONFLICT (user_id) DO NOTHING;

-- Note: We're keeping the phone column in profiles for now as a backup
-- It will be removed in Phase 2D after frontend updates and testing