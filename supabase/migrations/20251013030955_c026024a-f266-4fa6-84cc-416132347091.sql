-- Create trigger function for updating blog timestamps
CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to blog tables
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_updated_at();

CREATE TRIGGER blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_updated_at();

-- Insert sample categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
  ('Travel Tips', 'travel-tips', 'Expert advice for your jungle adventure'),
  ('Wildlife', 'wildlife', 'Discover Suriname''s amazing biodiversity'),
  ('Local Culture', 'local-culture', 'Stories from the heart of Suriname'),
  ('Accommodation', 'accommodation', 'Guides to jungle lodges and stays');

-- Insert sample tags
INSERT INTO public.blog_tags (name, slug) VALUES
  ('Adventure', 'adventure'),
  ('Eco-Tourism', 'eco-tourism'),
  ('Photography', 'photography'),
  ('Family Travel', 'family-travel'),
  ('Solo Travel', 'solo-travel'),
  ('Budget Tips', 'budget-tips');