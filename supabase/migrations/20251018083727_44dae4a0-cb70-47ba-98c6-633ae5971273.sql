-- Fix RLS policies to allow anonymous (public) users to view active content
-- This enables the frontend to display content without requiring authentication

-- Properties: Allow anon users to view active properties
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
CREATE POLICY "Properties are viewable by everyone"
ON public.properties
FOR SELECT
TO authenticated, anon
USING (
  (is_active = true) 
  OR (host_id = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Experiences: Allow anon users to view active experiences
DROP POLICY IF EXISTS "Experiences are viewable by everyone" ON public.experiences;
CREATE POLICY "Experiences are viewable by everyone"
ON public.experiences
FOR SELECT
TO authenticated, anon
USING (
  (is_active = true) 
  OR (host_id = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Transport: Allow anon users to view active transport
DROP POLICY IF EXISTS "Transport is viewable by everyone" ON public.transport;
CREATE POLICY "Transport is viewable by everyone"
ON public.transport
FOR SELECT
TO authenticated, anon
USING (
  (is_active = true) 
  OR (provider_id = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Packages: Allow anon users to view active packages
DROP POLICY IF EXISTS "Packages are viewable by everyone" ON public.packages;
CREATE POLICY "Packages are viewable by everyone"
ON public.packages
FOR SELECT
TO authenticated, anon
USING (
  (is_active = true) 
  OR (creator_id = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Events: Allow anon users to view active events
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone"
ON public.events
FOR SELECT
TO authenticated, anon
USING (
  (is_active = true) 
  OR (organizer_id = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Blog Posts: Allow anon users to view published posts
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published blog posts are viewable by everyone"
ON public.blog_posts
FOR SELECT
TO authenticated, anon
USING (
  (status = 'published') 
  OR (author_id = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Pages: Allow anon users to view published pages
DROP POLICY IF EXISTS "Published pages are viewable by everyone" ON public.pages;
CREATE POLICY "Published pages are viewable by everyone"
ON public.pages
FOR SELECT
TO authenticated, anon
USING (
  (status = 'published') 
  OR (created_by = auth.uid()) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Related tables that should also be public
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Amenities are viewable by everyone" ON public.amenities;
CREATE POLICY "Amenities are viewable by everyone"
ON public.amenities
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Property amenities are viewable by everyone" ON public.property_amenities;
CREATE POLICY "Property amenities are viewable by everyone"
ON public.property_amenities
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.blog_categories;
CREATE POLICY "Categories are viewable by everyone"
ON public.blog_categories
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.blog_tags;
CREATE POLICY "Tags are viewable by everyone"
ON public.blog_tags
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Post tags are viewable by everyone" ON public.blog_post_tags;
CREATE POLICY "Post tags are viewable by everyone"
ON public.blog_post_tags
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Package items are viewable by everyone" ON public.package_items;
CREATE POLICY "Package items are viewable by everyone"
ON public.package_items
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Media files are viewable by everyone" ON public.media_library;
CREATE POLICY "Media files are viewable by everyone"
ON public.media_library
FOR SELECT
TO authenticated, anon
USING (true);

DROP POLICY IF EXISTS "Page sections are viewable with their page" ON public.page_sections;
CREATE POLICY "Page sections are viewable with their page"
ON public.page_sections
FOR SELECT
TO authenticated, anon
USING (
  EXISTS (
    SELECT 1 FROM public.pages
    WHERE pages.id = page_sections.page_id
    AND (
      pages.status = 'published'
      OR pages.created_by = auth.uid()
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  )
);