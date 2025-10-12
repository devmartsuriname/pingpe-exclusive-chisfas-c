import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  guests?: number;
  bedrooms?: number;
  propertyType?: string;
  amenities?: string[];
  sortBy?: string;
}

export const useProperties = (filters: PropertyFilters = {}) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("is_active", true);

      // Apply filters
      if (filters.minPrice) {
        query = query.gte("price_per_night", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price_per_night", filters.maxPrice);
      }
      if (filters.guests) {
        query = query.gte("guests", filters.guests);
      }
      if (filters.bedrooms) {
        query = query.gte("bedrooms", filters.bedrooms);
      }
      if (filters.propertyType) {
        query = query.eq("property_type", filters.propertyType as any);
      }

      // Apply sorting
      if (filters.sortBy === "price_asc") {
        query = query.order("price_per_night", { ascending: true });
      } else if (filters.sortBy === "price_desc") {
        query = query.order("price_per_night", { ascending: false });
      } else if (filters.sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    },
  });
};

export const usePropertyDetail = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
