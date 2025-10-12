import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalBookings: number;
  totalRevenue: number;
  pendingApprovals: number;
  occupancyRate: number;
  revenueToday: number;
  revenueYesterday: number;
  revenueTrend: number;
  activeUsers: number;
  averageRating: number;
  refundRate: number;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      // Get total bookings
      const { count: totalBookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      // Get total revenue from completed bookings
      const { data: revenueData } = await supabase
        .from("bookings")
        .select("total_price")
        .eq("status", "completed");

      const totalRevenue = revenueData?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0;

      // Get pending approvals
      const { count: pendingApprovals } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Calculate occupancy rate (simplified - based on confirmed bookings vs total capacity)
      const { count: confirmedBookings } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .in("status", ["confirmed", "completed"]);

      const { count: totalProperties } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

      const occupancyRate = totalProperties && confirmedBookings 
        ? (confirmedBookings / (totalProperties * 30)) * 100 
        : 0;

      // Get revenue today vs yesterday
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: todayRevenue } = await supabase
        .from("bookings")
        .select("total_price")
        .eq("status", "completed")
        .gte("created_at", today.toISOString())
        .lt("created_at", tomorrow.toISOString());

      const { data: yesterdayRevenue } = await supabase
        .from("bookings")
        .select("total_price")
        .eq("status", "completed")
        .gte("created_at", yesterday.toISOString())
        .lt("created_at", today.toISOString());

      const revenueToday = todayRevenue?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;
      const revenueYesterday = yesterdayRevenue?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;
      const revenueTrend = revenueYesterday > 0 ? ((revenueToday - revenueYesterday) / revenueYesterday) * 100 : 0;

      // Get active users (users who updated profile in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: activeUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("updated_at", thirtyDaysAgo.toISOString());

      // Get average rating
      const { data: reviews } = await supabase
        .from("reviews")
        .select("rating");

      const averageRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Get refund rate
      const { count: refundCount } = await supabase
        .from("refunds")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const refundRate = totalBookings && refundCount 
        ? (refundCount / totalBookings) * 100 
        : 0;

      return {
        totalBookings: totalBookings || 0,
        totalRevenue,
        pendingApprovals: pendingApprovals || 0,
        occupancyRate: Math.round(occupancyRate),
        revenueToday,
        revenueYesterday,
        revenueTrend: Math.round(revenueTrend * 10) / 10,
        activeUsers: activeUsers || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        refundRate: Math.round(refundRate * 10) / 10,
      };
    },
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ["revenue-data"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("created_at, total_price")
        .eq("status", "completed")
        .order("created_at", { ascending: true });

      // Group by month
      const monthlyRevenue: Record<string, number> = {};
      data?.forEach((booking) => {
        const month = new Date(booking.created_at).toLocaleDateString("en-US", { month: "short" });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(booking.total_price);
      });

      return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue,
      }));
    },
  });
}

export function useBookingTrends() {
  return useQuery({
    queryKey: ["booking-trends"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("created_at")
        .order("created_at", { ascending: true });

      // Group by month
      const monthlyBookings: Record<string, number> = {};
      data?.forEach((booking) => {
        const month = new Date(booking.created_at).toLocaleDateString("en-US", { month: "short" });
        monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
      });

      return Object.entries(monthlyBookings).map(([month, bookings]) => ({
        month,
        bookings,
      }));
    },
  });
}
