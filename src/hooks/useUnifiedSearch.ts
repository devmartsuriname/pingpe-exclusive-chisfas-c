import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UnifiedSearchParams {
  location?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  guests?: number;
  type?: "stays" | "experiences" | "transport" | "packages" | "all";
}

export interface SearchResult {
  id: string;
  type: "stay" | "experience" | "transport" | "package";
  title: string;
  location: string;
  price: number;
  priceUnit: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
}

export const useUnifiedSearch = (params: UnifiedSearchParams) => {
  return useQuery({
    queryKey: ["unified-search", params],
    queryFn: async () => {
      const results: SearchResult[] = [];

      // Search Properties (Stays)
      if (!params.type || params.type === "stays" || params.type === "all") {
        let propertiesQuery = supabase
          .from("properties")
          .select("*")
          .eq("is_active", true);

        if (params.location) {
          propertiesQuery = propertiesQuery.or(
            `city.ilike.%${params.location}%,address.ilike.%${params.location}%`
          );
        }
        if (params.guests) {
          propertiesQuery = propertiesQuery.gte("guests", params.guests);
        }

        const { data: properties } = await propertiesQuery;

        results.push(
          ...(properties?.map((p) => ({
            id: p.id,
            type: "stay" as const,
            title: p.title,
            location: `${p.city}, ${p.country}`,
            price: p.price_per_night,
            priceUnit: "night",
            images: p.images || [],
          })) || [])
        );
      }

      // Search Experiences
      if (!params.type || params.type === "experiences" || params.type === "all") {
        let experiencesQuery = supabase
          .from("experiences")
          .select("*")
          .eq("is_active", true);

        if (params.location) {
          experiencesQuery = experiencesQuery.ilike(
            "meeting_point",
            `%${params.location}%`
          );
        }
        if (params.guests) {
          experiencesQuery = experiencesQuery.gte("max_participants", params.guests);
        }

        const { data: experiences } = await experiencesQuery;

        results.push(
          ...(experiences?.map((e) => ({
            id: e.id,
            type: "experience" as const,
            title: e.title,
            location: e.meeting_point,
            price: e.price_per_person,
            priceUnit: "person",
            images: e.images || [],
          })) || [])
        );
      }

      return results;
    },
    enabled: !!params.location || !!params.guests,
  });
};
