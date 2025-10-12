import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/admin/components/tables/DataTable";
import { usePartners } from "@/admin/hooks/usePartners";
import { Eye, Plus } from "lucide-react";
import { format } from "date-fns";

export default function PartnersList() {
  const { partners, isLoading } = usePartners();

  const columns = [
    { key: "name", label: "Partner Name" },
    { key: "contact_email", label: "Email" },
    { key: "contact_phone", label: "Phone" },
    {
      key: "commission_rate",
      label: "Commission",
      render: (item: any) => `${item.commission_rate}%`,
    },
    {
      key: "is_active",
      label: "Status",
      render: (item: any) => (
        <Badge variant={item.is_active ? "default" : "secondary"}>
          {item.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "partner_bookings",
      label: "Total Earnings",
      render: (item: any) => {
        const total = item.partner_bookings?.reduce(
          (sum: number, pb: any) => sum + Number(pb.commission_amount),
          0
        ) || 0;
        return `$${total.toFixed(2)}`;
      },
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
          <Link to={`/admin/partners/${item.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading partners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partners Management</h1>
          <p className="text-muted-foreground">Manage partners and commissions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <DataTable
        data={partners}
        columns={columns}
        searchPlaceholder="Search partners..."
      />
    </div>
  );
}
