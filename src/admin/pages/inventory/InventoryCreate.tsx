import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function InventoryCreate() {
  const { type } = useParams();
  const navigate = useNavigate();

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
        <CardContent>
          <p className="text-muted-foreground">
            Form implementation for {type} will be added in the next iteration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
