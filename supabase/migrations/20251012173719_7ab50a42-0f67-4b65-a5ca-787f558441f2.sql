
-- Remove guest role and keep only admin for info@devmart.sr
DELETE FROM public.user_roles 
WHERE user_id = '6a7f84ac-0202-488c-8d59-22d65da67114' 
AND role = 'guest'::app_role;
