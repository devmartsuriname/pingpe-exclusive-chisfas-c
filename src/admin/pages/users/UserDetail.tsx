import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useUsers } from "@/admin/hooks/useUsers";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRole, removeRole } = useUsers();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      // Step 1: Fetch profile by profiles.id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) return null;

      // Step 2: Fetch user roles by user_id
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", profile.user_id);

      if (rolesError) throw rolesError;

      // Step 3: Fetch contact info by user_id
      const { data: contactData } = await supabase
        .from("user_contact_info")
        .select("phone")
        .eq("user_id", profile.user_id)
        .maybeSingle();

      // Step 4: Merge all data
      return {
        ...profile,
        user_roles: roles || [],
        phone: contactData?.phone || null,
      };
    },
  });

  const handleAddRole = () => {
    if (selectedRole && user?.user_id) {
      addRole({ userId: user.user_id, role: selectedRole as "admin" | "host" | "guest" });
      setSelectedRole("");
    }
  };

  const handleRemoveRole = (role: string) => {
    if (user?.user_id) {
      removeRole({ userId: user.user_id, role: role as "admin" | "host" | "guest" });
    }
  };

  if (isLoading) {
    return <div>Loading user details...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const userRoles = Array.isArray(user.user_roles) ? user.user_roles : [];
  const availableRoles = ["admin", "host", "guest"].filter(
    (role) => !userRoles.some((ur: any) => ur.role === role)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground">{user.full_name}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar_url || "/placeholder.svg"}
                alt={user.full_name}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-lg">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">{user.phone || "No phone"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="text-sm">{user.bio || "No bio provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">{format(new Date(user.created_at), "MMMM dd, yyyy")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Roles</p>
              <div className="flex gap-2 flex-wrap">
                {userRoles.length > 0 ? (
                  userRoles.map((ur: any, idx: number) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      {ur.role}
                      <button
                        onClick={() => handleRemoveRole(ur.role)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">guest</Badge>
                )}
              </div>
            </div>

            {availableRoles.length > 0 && (
              <div className="flex gap-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddRole} disabled={!selectedRole}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
