import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DateRange {
  from: Date;
  to: Date;
}

export const useBookingAnalytics = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ["booking-analytics", dateRange],
    queryFn: async () => {
      const { from, to } = dateRange;
      
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());

      if (error) throw error;

      const totalBookings = bookings?.length || 0;
      const completed = bookings?.filter(b => b.status === "completed").length || 0;
      const pending = bookings?.filter(b => b.status === "pending").length || 0;
      const cancelled = bookings?.filter(b => b.status === "cancelled").length || 0;
      const confirmed = bookings?.filter(b => b.status === "confirmed").length || 0;

      // Status breakdown
      const statusBreakdown = [
        { name: "Completed", value: completed },
        { name: "Confirmed", value: confirmed },
        { name: "Pending", value: pending },
        { name: "Cancelled", value: cancelled }
      ];

      // Occupancy data
      const { data: properties } = await supabase
        .from("properties")
        .select("id, title");

      const occupancyData = properties?.map(prop => {
        const propBookings = bookings?.filter(b => b.property_id === prop.id && b.status === "completed") || [];
        return {
          property: prop.title,
          occupancy: propBookings.length > 0 ? Math.min(100, propBookings.length * 10) : 0
        };
      }) || [];

      return {
        totalBookings,
        completed,
        pending,
        cancelled,
        confirmed,
        bookingGrowth: 0,
        statusBreakdown,
        occupancyData
      };
    },
  });
};
