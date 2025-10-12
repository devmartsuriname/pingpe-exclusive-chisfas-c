import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DateRange {
  from: Date;
  to: Date;
}

export const usePerformanceReports = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ["performance-reports", dateRange],
    queryFn: async () => {
      const { from, to } = dateRange;
      
      // Fetch bookings with property info
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*, properties(host_id, title)")
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString())
        .eq("status", "completed");

      // Fetch host profiles
      const hostIds = [...new Set(bookings?.map(b => b.properties?.host_id).filter(Boolean))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", hostIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]));

      // Calculate host performance
      const hostRevenue: Record<string, { name: string; revenue: number; bookings: number }> = {};
      
      bookings?.forEach(booking => {
        const hostId = booking.properties?.host_id;
        const hostName = profileMap.get(hostId || "") || "Unknown";
        
        if (hostId) {
          if (!hostRevenue[hostId]) {
            hostRevenue[hostId] = { name: hostName, revenue: 0, bookings: 0 };
          }
          hostRevenue[hostId].revenue += Number(booking.total_price);
          hostRevenue[hostId].bookings += 1;
        }
      });

      const topPerformers = Object.values(hostRevenue)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Calculate average rating
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating");

      const avgRating = reviews?.length 
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
        : 0;

      // Count active hosts
      const { data: properties } = await supabase
        .from("properties")
        .select("host_id")
        .eq("is_active", true);

      const activeHosts = new Set(properties?.map(p => p.host_id)).size;

      return {
        topHostRevenue: topPerformers[0]?.revenue || 0,
        topHostName: topPerformers[0]?.name || "N/A",
        avgRating,
        activeHosts,
        avgOccupancy: 65, // Placeholder
        topPerformers
      };
    },
  });
};
