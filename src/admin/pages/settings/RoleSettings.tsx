import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RoleMatrix from "@/admin/components/settings/RoleMatrix";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Users } from "lucide-react";

export default function RoleSettings() {
  const { data: roleCounts } = useQuery({
    queryKey: ["role-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role");

      if (error) throw error;

      const counts = data.reduce((acc, { role }) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return counts;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Roles & Permissions</h2>
        <p className="text-muted-foreground">View role permissions and user distribution</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts?.admin || 0}</div>
            <p className="text-xs text-muted-foreground">Full platform access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Host Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts?.host || 0}</div>
            <p className="text-xs text-muted-foreground">Inventory providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts?.guest || 0}</div>
            <p className="text-xs text-muted-foreground">Booking customers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            Overview of permissions assigned to each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoleMatrix />
        </CardContent>
      </Card>
    </div>
  );
}
