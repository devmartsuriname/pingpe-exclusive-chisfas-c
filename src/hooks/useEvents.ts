import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EventFilters {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  maxAttendees?: number;
  sortBy?: string;
}

export const useEvents = (filters: EventFilters = {}) => {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .eq("is_active", true);

      if (filters.minPrice) {
        query = query.gte("price_per_person", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price_per_person", filters.maxPrice);
      }
      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.maxAttendees) {
        query = query.gte("max_attendees", filters.maxAttendees);
      }

      if (filters.sortBy === "price_asc") {
        query = query.order("price_per_person", { ascending: true });
      } else if (filters.sortBy === "price_desc") {
        query = query.order("price_per_person", { ascending: false });
      } else {
        query = query.order("event_date", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
};

export const useEventDetail = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
