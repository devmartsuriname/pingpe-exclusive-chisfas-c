import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Bookings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
        <p className="text-muted-foreground">View and manage all bookings</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Bookings management module will be implemented in Session 2.</p>
        </CardContent>
      </Card>
    </div>
  );
}
