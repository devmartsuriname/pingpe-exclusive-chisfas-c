-- Create pages table
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  seo_meta JSONB DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page_sections table
CREATE TABLE public.page_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_pages_created_by ON public.pages(created_by);
CREATE INDEX idx_page_sections_page_id ON public.page_sections(page_id);
CREATE INDEX idx_page_sections_position ON public.page_sections(page_id, position);

-- Enable Row Level Security
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages
CREATE POLICY "Published pages are viewable by everyone"
ON public.pages FOR SELECT
USING (status = 'published' OR created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins and hosts can create pages"
ON public.pages FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'host'));

CREATE POLICY "Creators can update their own pages, admins can update all"
ON public.pages FOR UPDATE
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can delete their own pages, admins can delete all"
ON public.pages FOR DELETE
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- RLS Policies for page_sections
CREATE POLICY "Page sections are viewable with their page"
ON public.page_sections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.pages
    WHERE id = page_sections.page_id
    AND (status = 'published' OR created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Page creators and admins can manage sections"
ON public.page_sections FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.pages
    WHERE id = page_sections.page_id
    AND (created_by = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);

-- Create updated_at triggers
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();