import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/admin/components/tables/DataTable";
import { useUsers } from "@/admin/hooks/useUsers";
import { Eye } from "lucide-react";
import { format } from "date-fns";

export default function UsersList() {
  const { users, isLoading } = useUsers();

  const columns = [
    {
      key: "avatar_url",
      label: "Avatar",
      render: (item: any) => (
        <img
          src={item.avatar_url || "/placeholder.svg"}
          alt={item.full_name}
          className="h-10 w-10 rounded-full object-cover"
        />
      ),
    },
    { key: "full_name", label: "Name" },
    { key: "user_id", label: "Email", render: (item: any) => item.user_id.slice(0, 20) + "..." },
    {
      key: "user_roles",
      label: "Roles",
      render: (item: any) => (
        <div className="flex gap-1 flex-wrap">
          {item.user_roles?.map((ur: any, idx: number) => (
            <Badge key={idx} variant="secondary">
              {ur.role}
            </Badge>
          )) || <Badge variant="outline">guest</Badge>}
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Joined",
      render: (item: any) => format(new Date(item.created_at), "MMM dd, yyyy"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <Button size="sm" variant="outline" asChild>
          <Link to={`/admin/users/${item.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">Manage users and roles</p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search users..."
      />
    </div>
  );
}
