import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MediaFile {
  id: string;
  name: string;
  alt_text?: string;
  url: string;
  thumbnail_url?: string;
  file_type: string;
  file_size: number;
  width?: number;
  height?: number;
  folder: string;
  tags: string[];
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export const useMediaFiles = (folder?: string, searchQuery?: string) => {
  return useQuery({
    queryKey: ["media-files", folder, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (folder && folder !== "all") {
        query = query.eq("folder", folder);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,alt_text.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MediaFile[];
    },
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File & { folder?: string; alt_text?: string; tags?: string[] }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media_library")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("media_library")
        .getPublicUrl(fileName);

      // Create metadata record
      const { data, error } = await supabase
        .from("media_library")
        .insert({
          name: file.name,
          alt_text: file.alt_text || "",
          url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          folder: file.folder || "root",
          tags: file.tags || [],
          uploaded_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-files"] });
      toast({ title: "File uploaded successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MediaFile> & { id: string }) => {
      const { data, error } = await supabase
        .from("media_library")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-files"] });
      toast({ title: "Media updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating media",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (media: MediaFile) => {
      // Delete from storage
      const fileName = media.url.split("/").slice(-2).join("/");
      const { error: storageError } = await supabase.storage
        .from("media_library")
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete metadata record
      const { error } = await supabase
        .from("media_library")
        .delete()
        .eq("id", media.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-files"] });
      toast({ title: "Media deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting media",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};