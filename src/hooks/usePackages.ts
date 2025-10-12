import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PackageFilters {
  minPrice?: number;
  maxPrice?: number;
  durationDays?: number;
  maxParticipants?: number;
  sortBy?: string;
}

export const usePackages = (filters: PackageFilters = {}) => {
  return useQuery({
    queryKey: ["packages", filters],
    queryFn: async () => {
      let query = supabase
        .from("packages")
        .select("*")
        .eq("is_active", true);

      if (filters.minPrice) {
        query = query.gte("price_total", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price_total", filters.maxPrice);
      }
      if (filters.durationDays) {
        query = query.eq("duration_days", filters.durationDays);
      }
      if (filters.maxParticipants) {
        query = query.gte("max_participants", filters.maxParticipants);
      }

      if (filters.sortBy === "price_asc") {
        query = query.order("price_total", { ascending: true });
      } else if (filters.sortBy === "price_desc") {
        query = query.order("price_total", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};

export const usePackageDetail = (id: string) => {
  return useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select(`
          *,
          profiles:creator_id (
            user_id,
            full_name,
            avatar_url,
            bio,
            created_at
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
