import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialReports } from "@/admin/hooks/useFinancialReports";
import { Skeleton } from "@/components/ui/skeleton";
import RevenueBreakdownChart from "@/admin/components/reports/RevenueBreakdownChart";
import CommissionTable from "@/admin/components/reports/CommissionTable";
import ReportFilters from "@/admin/components/reports/ReportFilters";
import { useState } from "react";
import { DollarSign, TrendingUp, RefreshCcw, CreditCard } from "lucide-react";

export default function FinancialReports() {
  const [dateRange, setDateRange] = useState({ from: new Date(new Date().setMonth(new Date().getMonth() - 1)), to: new Date() });
  
  const { data: financialData, isLoading } = useFinancialReports(dateRange);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  // Prepare export data
  const exportData = financialData ? [
    {
      metric: "Total Revenue",
      value: financialData.totalRevenue || 0,
      growth: `${financialData.revenueGrowth?.toFixed(1) || 0}%`
    },
    {
      metric: "Average Booking Value",
      value: financialData.avgBookingValue?.toFixed(2) || 0,
      bookings: financialData.bookings || 0
    },
    {
      metric: "Total Commissions",
      value: financialData.totalCommissions || 0,
      unpaid: financialData.unpaidCommissions || 0
    },
    {
      metric: "Total Refunds",
      value: financialData.totalRefunds || 0,
      rate: `${financialData.refundRate?.toFixed(1) || 0}%`
    },
    ...((financialData.revenueByType || []) as Array<{ name: string; value: number }>).map(item => ({
      metric: `Revenue - ${item.name}`,
      value: item.value
    }))
  ] : [];

  return (
    <div className="space-y-6">
      <ReportFilters 
        dateRange={dateRange} 
        onDateRangeChange={setDateRange}
        exportData={exportData}
        exportFilename="financial-report"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {financialData?.revenueGrowth > 0 ? '+' : ''}{financialData?.revenueGrowth?.toFixed(1)}% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData?.avgBookingValue?.toFixed(2) || 0}</div>
            <p className="text-xs text-muted-foreground">
              {financialData?.bookings || 0} total bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData?.totalCommissions?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${financialData?.unpaidCommissions || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
            <RefreshCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialData?.totalRefunds?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {financialData?.refundRate?.toFixed(1)}% refund rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Inventory Type</CardTitle>
            <CardDescription>Breakdown of revenue across all inventory categories</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueBreakdownChart data={financialData?.revenueByType as Array<{ name: string; value: number }> || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Partner Commissions</CardTitle>
            <CardDescription>Commission tracking and payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <CommissionTable data={financialData?.commissions || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
