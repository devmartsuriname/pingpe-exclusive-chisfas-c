import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertyForm } from "@/admin/components/forms/PropertyForm";
import { ExperienceForm } from "@/admin/components/forms/ExperienceForm";
import { TransportForm } from "@/admin/components/forms/TransportForm";
import { PackageForm } from "@/admin/components/forms/PackageForm";
import { EventForm } from "@/admin/components/forms/EventForm";

export default function InventoryEdit() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getTableName = () => {
    switch (type) {
      case "stay": return "properties";
      case "experience": return "experiences";
      case "transport": return "transport";
      case "package": return "packages";
      case "event": return "events";
      default: return null;
    }
  };

  const { data: item, isLoading } = useQuery({
    queryKey: ["inventory-item", type, id],
    queryFn: async () => {
      const table = getTableName();
      if (!table) throw new Error("Invalid type");

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const table = getTableName();
      if (!table) throw new Error("Invalid type");

      const { error } = await supabase
        .from(table)
        .update(data)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: `${type} updated successfully` });
      navigate("/admin/inventory");
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update " + type,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const renderForm = () => {
    if (isLoading) return <p>Loading...</p>;
    if (!item) return <p>Item not found</p>;

    switch (type) {
      case "stay":
        return (
          <PropertyForm
            defaultValues={item}
            onSubmit={(data) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            defaultValues={item}
            onSubmit={(data) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />
        );
      case "transport":
        return (
          <TransportForm
            defaultValues={item}
            onSubmit={(data) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />
        );
      case "package":
        return (
          <PackageForm
            defaultValues={item}
            onSubmit={(data) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />
        );
      case "event":
        return (
          <EventForm
            defaultValues={item}
            onSubmit={(data) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />
        );
      default:
        return <p className="text-muted-foreground">Form for {type} is not yet implemented.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit {type}</h1>
          <p className="text-muted-foreground">Update {type} details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Form</CardTitle>
        </CardHeader>
        <CardContent>{renderForm()}</CardContent>
      </Card>
    </div>
  );
}
