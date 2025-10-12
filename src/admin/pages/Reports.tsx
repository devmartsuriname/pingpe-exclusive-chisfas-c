import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialReports from "./reports/FinancialReports";
import BookingAnalytics from "./reports/BookingAnalytics";
import PerformanceReports from "./reports/PerformanceReports";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
      </div>
      
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-6">
          <FinancialReports />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-6">
          <BookingAnalytics />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <PerformanceReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
