import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Experience = Database["public"]["Tables"]["experiences"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ExperienceWithDetails = Experience & {
  profiles: Profile | null;
};

interface ExperienceFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxParticipants?: number;
  difficultyLevel?: string;
  language?: string;
  sortBy?: string;
  location?: string;
  guests?: number;
}

export const useExperiences = (filters: ExperienceFilters = {}) => {
  return useQuery({
    queryKey: ["experiences", filters],
    queryFn: async () => {
      let query = supabase
        .from("experiences")
        .select("*")
        .eq("is_active", true);

      if (filters.minPrice) {
        query = query.gte("price_per_person", filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte("price_per_person", filters.maxPrice);
      }
      if (filters.maxParticipants) {
        query = query.gte("max_participants", filters.maxParticipants);
      }
      if (filters.difficultyLevel) {
        query = query.eq("difficulty_level", filters.difficultyLevel);
      }
      if (filters.location) {
        query = query.ilike("meeting_point", `%${filters.location}%`);
      }
      if (filters.guests) {
        query = query.gte("max_participants", filters.guests);
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

export const useExperienceDetail = (id: string) => {
  return useQuery<ExperienceWithDetails>({
    queryKey: ["experience", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select(`
          *,
          profiles:host_id (
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
      return data as unknown as ExperienceWithDetails;
    },
    enabled: !!id,
  });
};
