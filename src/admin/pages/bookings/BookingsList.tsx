import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/admin/components/tables/DataTable";
import { useBookings } from "@/admin/hooks/useBookings";
import { Eye } from "lucide-react";
import { format } from "date-fns";

export default function BookingsList() {
  const { bookings, isLoading, updateStatus } = useBookings();
  const [filter, setFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const columns = [
    { key: "id", label: "Booking ID", render: (item: any) => item.id.slice(0, 8) },
    {
      key: "guest",
      label: "Guest",
      render: (item: any) => item.guest?.full_name || "N/A",
    },
    {
      key: "property",
      label: "Listing",
      render: (item: any) => item.property?.title || "N/A",
    },
    {
      key: "check_in",
      label: "Check-in",
      render: (item: any) => format(new Date(item.check_in), "MMM dd, yyyy"),
    },
    {
      key: "check_out",
      label: "Check-out",
      render: (item: any) => format(new Date(item.check_out), "MMM dd, yyyy"),
    },
    {
      key: "status",
      label: "Status",
      render: (item: any) => (
        <Badge variant={getStatusColor(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "total_price",
      label: "Total",
      render: (item: any) => `$${item.total_price}`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/admin/bookings/${item.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {item.status === "pending" && (
            <Button
              size="sm"
              onClick={() => updateStatus({ id: item.id, status: "confirmed" })}
            >
              Approve
            </Button>
          )}
        </div>
      ),
    },
  ];

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter((b: any) => b.status === filter);

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
        <p className="text-muted-foreground">View and manage all bookings</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
        <Button
          variant={filter === "confirmed" ? "default" : "outline"}
          onClick={() => setFilter("confirmed")}
        >
          Confirmed
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
        <Button
          variant={filter === "cancelled" ? "default" : "outline"}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled
        </Button>
      </div>

      <DataTable
        data={filteredBookings}
        columns={columns}
        searchPlaceholder="Search bookings..."
      />
    </div>
  );
}
