import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/admin/components/tables/DataTable";
import { useProperties } from "@/hooks/useProperties";
import { useExperiences } from "@/hooks/useExperiences";
import { useTransport } from "@/hooks/useTransport";
import { usePackages } from "@/hooks/usePackages";
import { useEvents } from "@/hooks/useEvents";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function InventoryList() {
  const [activeTab, setActiveTab] = useState("stays");
  const { data: properties } = useProperties();
  const { data: experiences } = useExperiences();
  const { data: transport } = useTransport();
  const { data: packages } = usePackages();
  const { data: events } = useEvents();

  const staysColumns = [
    {
      key: "images",
      label: "Image",
      render: (item: any) => (
        <img src={item.images?.[0]} alt={item.title} className="h-12 w-16 rounded object-cover" />
      ),
    },
    { key: "title", label: "Title" },
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
      key: "price_per_night",
      label: "Price",
      render: (item: any) => `$${item.price_per_night}/night`,
    },
    { key: "city", label: "Location" },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/admin/inventory/edit/stay/${item.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const experiencesColumns = [
    {
      key: "images",
      label: "Image",
      render: (item: any) => (
        <img src={item.images?.[0]} alt={item.title} className="h-12 w-16 rounded object-cover" />
      ),
    },
    { key: "title", label: "Title" },
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
      key: "price_per_person",
      label: "Price",
      render: (item: any) => `$${item.price_per_person}/person`,
    },
    {
      key: "duration_hours",
      label: "Duration",
      render: (item: any) => `${item.duration_hours}h`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/admin/inventory/edit/experience/${item.id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" variant="outline">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Manage all listings and inventory items</p>
        </div>
        <Button asChild>
          <Link to={`/admin/inventory/create/${activeTab === "stays" ? "stay" : activeTab.slice(0, -1)}`}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="stays">Stays</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="stays" className="space-y-4">
          <DataTable
            data={properties || []}
            columns={staysColumns}
            searchPlaceholder="Search stays..."
          />
        </TabsContent>

        <TabsContent value="experiences" className="space-y-4">
          <DataTable
            data={experiences || []}
            columns={experiencesColumns}
            searchPlaceholder="Search experiences..."
          />
        </TabsContent>

        <TabsContent value="transport" className="space-y-4">
          <DataTable
            data={transport || []}
            columns={experiencesColumns}
            searchPlaceholder="Search transport..."
          />
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <DataTable
            data={packages || []}
            columns={experiencesColumns}
            searchPlaceholder="Search packages..."
          />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <DataTable
            data={events || []}
            columns={experiencesColumns}
            searchPlaceholder="Search events..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
