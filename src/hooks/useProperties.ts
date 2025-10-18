import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Property = Database["public"]["Tables"]["properties"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Amenity = Database["public"]["Tables"]["amenities"]["Row"];
type Review = Database["public"]["Tables"]["reviews"]["Row"];

export type PropertyWithDetails = Property & {
  profiles: Profile | null;
  property_amenities: Array<{
    amenities: Amenity;
  }>;
  reviews: Array<Review & {
    profiles: Profile | null;
  }>;
};

interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  guests?: number;
  bedrooms?: number;
  propertyType?: string;
  amenities?: string[];
  sortBy?: string;
  location?: string;
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
      if (filters.location) {
        query = query.or(`city.ilike.%${filters.location}%,address.ilike.%${filters.location}%`);
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
  return useQuery<PropertyWithDetails>({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          profiles:host_id (
            user_id,
            full_name,
            avatar_url,
            bio,
            created_at
          ),
          property_amenities (
            amenities (
              id,
              name,
              icon,
              category
            )
          ),
          reviews (
            id,
            rating,
            comment,
            created_at,
            profiles:reviewer_id (
              user_id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as unknown as PropertyWithDetails;
    },
    enabled: !!id,
  });
};
