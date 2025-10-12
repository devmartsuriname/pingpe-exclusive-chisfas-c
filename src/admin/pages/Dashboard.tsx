import { DollarSign, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import StatCard from "@/admin/components/cards/StatCard";
import RevenueChart from "@/admin/components/charts/RevenueChart";
import BookingTrendsChart from "@/admin/components/charts/BookingTrendsChart";
import { useAdminStats, useRevenueData, useBookingTrends } from "@/admin/hooks/useAdminStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueData();
  const { data: bookingData, isLoading: bookingLoading } = useBookingTrends();

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

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={Calendar}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue.toLocaleString() || 0}`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats?.occupancyRate || 0}%`}
          icon={TrendingUp}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          icon={AlertCircle}
          iconColor="text-orange-600"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
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
