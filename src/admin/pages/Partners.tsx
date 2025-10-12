import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Partners() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Partners Management</h1>
        <p className="text-muted-foreground">Manage partners and commissions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Partners management module will be implemented in Session 2.</p>
        </CardContent>
      </Card>
    </div>
  );
}
