import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type EventWithDetails = Event & {
  profiles: Profile | null;
};

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
  return useQuery<EventWithDetails>({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles:organizer_id (
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
      return data as unknown as EventWithDetails;
    },
    enabled: !!id,
  });
};
