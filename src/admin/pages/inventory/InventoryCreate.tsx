import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PropertyForm } from "@/admin/components/forms/PropertyForm";
import { ExperienceForm } from "@/admin/components/forms/ExperienceForm";
import { TransportForm } from "@/admin/components/forms/TransportForm";

export default function InventoryCreate() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");

      let table: "properties" | "experiences" | "transport" = "properties";
      let payload: any = { ...data };

      if (type === "stay") {
        table = "properties";
        payload.host_id = user.data.user.id;
        payload.is_active = true;
      } else if (type === "experience") {
        table = "experiences";
        payload.host_id = user.data.user.id;
        payload.is_active = true;
      } else if (type === "transport") {
        table = "transport";
        payload.provider_id = user.data.user.id;
        payload.is_active = true;
      } else {
        throw new Error("Invalid inventory type");
      }

      const { error } = await supabase.from(table).insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: `${type} created successfully` });
      navigate("/admin/inventory");
      queryClient.invalidateQueries({ queryKey: ["admin-inventory"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create " + type,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const renderForm = () => {
    switch (type) {
      case "stay":
        return (
          <PropertyForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        );
      case "transport":
        return (
          <TransportForm
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        );
      default:
        return (
          <p className="text-muted-foreground">
            Form for {type} is not yet implemented. Supported types: stay, experience, transport.
          </p>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/admin/inventory")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create {type}</h1>
          <p className="text-muted-foreground">Add a new {type} to inventory</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Form</CardTitle>
        </CardHeader>
        <CardContent>{renderForm()}</CardContent>
      </Card>
    </div>
  );
}
