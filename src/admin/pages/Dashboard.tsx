import { DollarSign, Calendar, TrendingUp, AlertCircle, Users, Star, RefreshCw, ArrowUp, ArrowDown } from "lucide-react";
import StatCard from "@/admin/components/cards/StatCard";
import RevenueChart from "@/admin/components/charts/RevenueChart";
import BookingTrendsChart from "@/admin/components/charts/BookingTrendsChart";
import ActivityFeed from "@/admin/components/dashboard/ActivityFeed";
import { useAdminStats, useRevenueData, useBookingTrends } from "@/admin/hooks/useAdminStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import EmailStatusWidget from "@/admin/components/dashboard/EmailStatusWidget";
import PaymentStatusWidget from "@/admin/components/dashboard/PaymentStatusWidget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: bookingData, isLoading: bookingLoading } = useBookingTrends();

  // Fetch upcoming bookings today
  const { data: upcomingToday } = useQuery({
    queryKey: ["upcoming-today"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("bookings")
        .select(`
          id,
          check_in,
          status,
          profiles!bookings_guest_id_fkey(full_name),
          properties(title)
        `)
        .eq("check_in", today)
        .order("created_at", { ascending: false })
        .limit(5);
      return data;
    },
  });

  // Fetch pending approvals
  const { data: pendingBookings } = useQuery({
    queryKey: ["pending-approvals"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select(`
          id,
          created_at,
          check_in,
          profiles!bookings_guest_id_fkey(full_name),
          properties(title)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);
      return data;
    },
  });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to PingPe Admin Dashboard</p>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/admin/reports")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString() || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stats?.revenueTrend !== undefined && stats.revenueTrend !== 0 && (
                <>
                  {stats.revenueTrend > 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={stats.revenueTrend > 0 ? "text-green-600" : "text-red-600"}>
                    {Math.abs(stats.revenueTrend)}%
                  </span>
                  <span className="ml-1">vs yesterday</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/admin/bookings")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.pendingApprovals || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/admin/users")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate("/admin/reports")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageRating || 0} ⭐</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.refundRate || 0}% refund rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity Feed */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {revenueLoading ? (
            <Skeleton className="h-[380px]" />
          ) : (
            <RevenueChart data={revenueData || []} />
          )}
          {bookingLoading ? (
            <Skeleton className="h-[380px]" />
          ) : (
            <BookingTrendsChart data={bookingData || []} />
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>

      {/* Status Widgets */}
      <div className="grid gap-4 md:grid-cols-3">
        <EmailStatusWidget />
        <PaymentStatusWidget />
        <div className="md:col-span-1 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings Today</CardTitle>
            <CardDescription>Check-ins scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingToday && upcomingToday.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingToday.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => navigate("/admin/bookings")}
                    >
                      <TableCell className="font-medium">
                        {(booking.profiles as any)?.full_name || "Guest"}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {(booking.properties as any)?.title || "Property"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No bookings today</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Bookings awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingBookings && pendingBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Check-in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingBookings.map((booking) => (
                    <TableRow
                      key={booking.id}
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => navigate("/admin/bookings")}
                    >
                      <TableCell className="font-medium">
                        {(booking.profiles as any)?.full_name || "Guest"}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {(booking.properties as any)?.title || "Property"}
                      </TableCell>
                      <TableCell>{new Date(booking.check_in).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No pending approvals</p>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <Button onClick={() => navigate("/admin/inventory")} variant="outline" className="w-full">
            Add New Listing
          </Button>
          <Button onClick={() => navigate("/admin/bookings")} variant="outline" className="w-full">
            Approve Bookings
          </Button>
          <Button onClick={() => navigate("/admin/reports")} variant="outline" className="w-full">
            View Reports
          </Button>
          <Button onClick={() => navigate("/admin/users")} variant="outline" className="w-full">
            Manage Users
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
