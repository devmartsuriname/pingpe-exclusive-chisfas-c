import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import slugify from "slugify";

export interface PageSection {
  id: string;
  page_id: string;
  type: string;
  content: Record<string, any>;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  seo_meta: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
  };
  created_by: string;
  created_at: string;
  updated_at: string;
  page_sections?: PageSection[];
}

export const usePages = (status?: "draft" | "published") => {
  return useQuery({
    queryKey: ["pages", status],
    queryFn: async () => {
      let query = supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Page[];
    },
  });
};

export const usePage = (slug: string) => {
  return useQuery({
    queryKey: ["page", slug],
    queryFn: async () => {
      const { data: pageData, error: pageError } = await supabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .single();

      if (pageError) throw pageError;

      const { data: sectionsData, error: sectionsError } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", pageData.id)
        .eq("is_visible", true)
        .order("position");

      if (sectionsError) throw sectionsError;

      return { ...pageData, page_sections: sectionsData } as Page;
    },
  });
};

export const usePageSections = (pageId: string) => {
  return useQuery({
    queryKey: ["page-sections", pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_id", pageId)
        .order("position");

      if (error) throw error;
      return data as PageSection[];
    },
  });
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (page: Partial<Page>) => {
      const slug = page.slug || slugify(page.title || "", { lower: true, strict: true });
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("pages")
        .insert({
          title: page.title,
          slug,
          status: page.status || "draft",
          seo_meta: page.seo_meta || {},
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast({ title: "Page created successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating page",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Page> & { id: string }) => {
      const { data, error } = await supabase
        .from("pages")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast({ title: "Page updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating page",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      toast({ title: "Page deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting page",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: {
      page_id: string;
      type: string;
      content: Record<string, any>;
      position: number;
      is_visible?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("page_sections")
        .insert({
          page_id: section.page_id,
          type: section.type,
          content: section.content,
          position: section.position,
          is_visible: section.is_visible ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["page-sections", variables.page_id] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PageSection> & { id: string }) => {
      const { data, error } = await supabase
        .from("page_sections")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["page-sections", data.page_id] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, page_id }: { id: string; page_id: string }) => {
      const { error } = await supabase
        .from("page_sections")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { page_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["page-sections", data.page_id] });
    },
  });
};

export const useReorderSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pageId, sections }: { pageId: string; sections: PageSection[] }) => {
      const updates = sections.map((section, index) => 
        supabase
          .from("page_sections")
          .update({ position: index })
          .eq("id", section.id)
      );

      await Promise.all(updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["page-sections", variables.pageId] });
    },
  });
};