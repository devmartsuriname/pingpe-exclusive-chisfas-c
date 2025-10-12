import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DateRange {
  from: Date;
  to: Date;
}

export const useFinancialReports = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ["financial-reports", dateRange],
    queryFn: async () => {
      const { from, to } = dateRange;
      
      // Fetch bookings data
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());

      if (error) throw error;

      // Calculate metrics
      const completedBookings = bookings?.filter(b => b.status === "completed") || [];
      const totalRevenue = completedBookings.reduce((sum, b) => sum + Number(b.total_price), 0);
      const avgBookingValue = completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0;

      // Revenue by type
      const revenueByType = completedBookings.reduce((acc: any, booking) => {
        const type = booking.inventory_type || "stay";
        if (!acc[type]) acc[type] = 0;
        acc[type] += Number(booking.total_price);
        return acc;
      }, {});

      // Fetch refunds
      const { data: refunds } = await supabase
        .from("refunds")
        .select("amount")
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());

      const totalRefunds = refunds?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      const refundRate = totalRevenue > 0 ? (totalRefunds / totalRevenue) * 100 : 0;

      // Fetch commissions
      const { data: commissions } = await supabase
        .from("partner_bookings")
        .select("*, partners(name), bookings!inner(created_at)")
        .gte("bookings.created_at", from.toISOString())
        .lte("bookings.created_at", to.toISOString());

      const totalCommissions = commissions?.reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0;
      const unpaidCommissions = commissions?.filter(c => !c.commission_paid).reduce((sum, c) => sum + Number(c.commission_amount), 0) || 0;

      return {
        totalRevenue,
        avgBookingValue,
        bookings: completedBookings.length,
        revenueGrowth: 0, // Calculate from previous period
        revenueByType: Object.entries(revenueByType).map(([name, value]) => ({ name, value })),
        totalRefunds,
        refundRate,
        totalCommissions,
        unpaidCommissions,
        commissions: commissions?.map(c => ({
          partner: c.partners?.name || "Unknown",
          amount: Number(c.commission_amount),
          paid: c.commission_paid,
          date: c.commission_paid_date
        })) || []
      };
    },
  });
};
