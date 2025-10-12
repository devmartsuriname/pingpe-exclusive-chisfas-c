import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <ShieldX className="w-24 h-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground text-lg">
          You don't have permission to access this page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/profile">Go to Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
