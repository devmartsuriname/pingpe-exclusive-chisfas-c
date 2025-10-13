import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import slugify from "slugify";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  category_id?: string;
  status: "draft" | "published";
  seo_meta: {
    title?: string;
    description?: string;
    keywords?: string;
    og_image?: string;
  };
  published_at?: string;
  created_at: string;
  updated_at: string;
  blog_categories?: { name: string };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export const useBlogPosts = (status?: "draft" | "published", page = 1, limit = 12) => {
  return useQuery({
    queryKey: ["blog-posts", status, page, limit],
    queryFn: async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("blog_posts")
        .select("*, blog_categories(name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { posts: data as BlogPost[], total: count || 0 };
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, blog_categories(name), blog_post_tags(blog_tags(*))")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: Partial<BlogPost>) => {
      const slug = post.slug || slugify(post.title || "", { lower: true, strict: true });
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: post.title,
          body: post.body,
          slug,
          author_id: user.user.id,
          excerpt: post.excerpt,
          featured_image: post.featured_image,
          category_id: post.category_id,
          status: post.status,
          seo_meta: post.seo_meta,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: "Blog post created successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: "Blog post updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast({ title: "Blog post deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as BlogCategory[];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: { name: string; description?: string }) => {
      const slug = slugify(category.name, { lower: true, strict: true });
      
      const { data, error } = await supabase
        .from("blog_categories")
        .insert({ ...category, slug })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
      toast({ title: "Category created successfully" });
    },
  });
};

export const useBlogTags = () => {
  return useQuery({
    queryKey: ["blog-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_tags")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as BlogTag[];
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const slug = slugify(name, { lower: true, strict: true });
      
      const { data, error } = await supabase
        .from("blog_tags")
        .insert({ name, slug })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      toast({ title: "Tag created successfully" });
    },
  });
};

export const usePostTags = (postId: string) => {
  return useQuery({
    queryKey: ["post-tags", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_post_tags")
        .select("tag_id, blog_tags(id, name, slug)")
        .eq("post_id", postId);

      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });
};

export const useAssignTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, tagId }: { postId: string; tagId: string }) => {
      const { error } = await supabase
        .from("blog_post_tags")
        .insert({ post_id: postId, tag_id: tagId });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post-tags", variables.postId] });
    },
  });
};

export const useRemoveTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, tagId }: { postId: string; tagId: string }) => {
      const { error } = await supabase
        .from("blog_post_tags")
        .delete()
        .eq("post_id", postId)
        .eq("tag_id", tagId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["post-tags", variables.postId] });
    },
  });
};

export const useRelatedPosts = (postId: string, categoryId?: string, limit = 3) => {
  return useQuery({
    queryKey: ["related-posts", postId, categoryId],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select("*, blog_categories(name)")
        .eq("status", "published")
        .neq("id", postId)
        .limit(limit);

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
    enabled: !!postId,
  });
};