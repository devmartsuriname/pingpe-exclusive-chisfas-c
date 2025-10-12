import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TransportFilters {
  minPrice?: number;
  maxPrice?: number;
  vehicleType?: string;
  capacity?: number;
  routeFrom?: string;
  routeTo?: string;
  sortBy?: string;
}

export const useTransport = (filters: TransportFilters = {}) => {
  return useQuery({
    queryKey: ["transport", filters],
    queryFn: async () => {
      let query = supabase
        .from("transport")
        .select("*")
        .eq("is_active", true);

      if (filters.minPrice) {
        query = query.gte("price_per_person", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price_per_person", filters.maxPrice);
      }
      if (filters.vehicleType) {
        query = query.eq("vehicle_type", filters.vehicleType);
      }
      if (filters.capacity) {
        query = query.gte("capacity", filters.capacity);
      }

      if (filters.sortBy === "price_asc") {
        query = query.order("price_per_person", { ascending: true });
      } else if (filters.sortBy === "price_desc") {
        query = query.order("price_per_person", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};

export const useTransportDetail = (id: string) => {
  return useQuery({
    queryKey: ["transport", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transport")
        .select(`
          *,
          profiles:provider_id (
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
