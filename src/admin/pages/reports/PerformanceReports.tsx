import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePerformanceReports } from "@/admin/hooks/usePerformanceReports";
import { Skeleton } from "@/components/ui/skeleton";
import TopPerformersTable from "@/admin/components/reports/TopPerformersTable";
import ReportFilters from "@/admin/components/reports/ReportFilters";
import { useState } from "react";
import { Trophy, Star, Users, TrendingUp } from "lucide-react";

export default function PerformanceReports() {
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().setMonth(new Date().getMonth() - 1)), to: new Date() });
  
  const { data: performanceData, isLoading } = usePerformanceReports(dateRange);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <ReportFilters dateRange={dateRange} onDateRangeChange={setDateRange} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Host Revenue</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${performanceData?.topHostRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {performanceData?.topHostName || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.avgRating?.toFixed(1) || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Hosts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.activeHosts || 0}</div>
            <p className="text-xs text-muted-foreground">
              With active listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.avgOccupancy?.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Average across properties
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Highest revenue hosts and listings</CardDescription>
          </CardHeader>
          <CardContent>
            <TopPerformersTable data={performanceData?.topPerformers || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
