
-- Promote info@devmart.sr to admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('6a7f84ac-0202-488c-8d59-22d65da67114', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;
