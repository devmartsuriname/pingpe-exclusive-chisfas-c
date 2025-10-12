import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingAnalytics } from "@/admin/hooks/useBookingAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import BookingStatusChart from "@/admin/components/reports/BookingStatusChart";
import OccupancyChart from "@/admin/components/reports/OccupancyChart";
import ReportFilters from "@/admin/components/reports/ReportFilters";
import { useState } from "react";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default function BookingAnalytics() {
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().setMonth(new Date().getMonth() - 1)), to: new Date() });
  
  const { data: analyticsData, isLoading } = useBookingAnalytics(dateRange);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  // Prepare export data
  const exportData = analyticsData ? [
    {
      metric: "Total Bookings",
      value: analyticsData.totalBookings || 0,
      growth: `${analyticsData.bookingGrowth?.toFixed(1) || 0}%`
    },
    {
      metric: "Completed Bookings",
      value: analyticsData.completed || 0,
      rate: `${((analyticsData.completed / analyticsData.totalBookings) * 100 || 0).toFixed(1)}%`
    },
    {
      metric: "Pending Bookings",
      value: analyticsData.pending || 0
    },
    {
      metric: "Cancelled Bookings",
      value: analyticsData.cancelled || 0,
      rate: `${((analyticsData.cancelled / analyticsData.totalBookings) * 100 || 0).toFixed(1)}%`
    },
    ...(analyticsData.statusBreakdown || []).map(item => ({
      status: item.name,
      count: item.value
    }))
  ] : [];

  return (
    <div className="space-y-6">
      <ReportFilters 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange}
        exportData={exportData}
        exportFilename="booking-analytics"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData?.bookingGrowth > 0 ? '+' : ''}{analyticsData?.bookingGrowth?.toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.completed || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((analyticsData?.completed / analyticsData?.totalBookings) * 100 || 0).toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.cancelled || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((analyticsData?.cancelled / analyticsData?.totalBookings) * 100 || 0).toFixed(1)}% cancellation rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
            <CardDescription>Overview of booking statuses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingStatusChart data={analyticsData?.statusBreakdown || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Trends</CardTitle>
            <CardDescription>Property occupancy rates and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <OccupancyChart data={analyticsData?.occupancyData || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
