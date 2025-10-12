import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, Star, RefreshCw } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface Activity {
  type: "booking" | "user" | "review" | "refund";
  title: string;
  subtitle: string;
  timestamp: string;
  icon: LucideIcon;
  link?: string;
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async (): Promise<Activity[]> => {
      // Fetch recent bookings
      const { data: recentBookings } = await supabase
        .from("bookings")
        .select(`
          id,
          created_at,
          check_in,
          profiles!bookings_guest_id_fkey(full_name),
          properties(title)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from("profiles")
        .select("user_id, full_name, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent reviews
      const { data: recentReviews } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          created_at,
          properties(title)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent refund requests
      const { data: recentRefunds } = await supabase
        .from("refunds")
        .select(`
          id,
          created_at,
          status,
          bookings(
            profiles!bookings_guest_id_fkey(full_name)
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      // Combine all activities
      const activities: Activity[] = [];

      recentBookings?.forEach((booking) => {
        activities.push({
          type: "booking",
          title: `New booking from ${(booking.profiles as any)?.full_name || "Guest"}`,
          subtitle: `${(booking.properties as any)?.title || "Property"} - ${new Date(booking.check_in).toLocaleDateString()}`,
          timestamp: booking.created_at,
          icon: Calendar,
          link: `/admin/bookings`,
        });
      });

      recentUsers?.forEach((user) => {
        activities.push({
          type: "user",
          title: "New user registered",
          subtitle: user.full_name || "New User",
          timestamp: user.created_at,
          icon: User,
          link: `/admin/users`,
        });
      });

      recentReviews?.forEach((review) => {
        activities.push({
          type: "review",
          title: `New ${review.rating}⭐ review`,
          subtitle: (review.properties as any)?.title || "Property",
          timestamp: review.created_at,
          icon: Star,
          link: `/admin/bookings`,
        });
      });

      recentRefunds?.forEach((refund) => {
        activities.push({
          type: "refund",
          title: `Refund request - ${refund.status}`,
          subtitle: `From ${((refund.bookings as any)?.profiles as any)?.full_name || "Guest"}`,
          timestamp: refund.created_at,
          icon: RefreshCw,
          link: `/admin/bookings`,
        });
      });

      // Sort by timestamp and return top 10
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
    },
  });
}
