import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plane, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { importPingPeTours, clearDemoTours, type ImportResult } from "@/admin/utils/importPingPeTours";

export function TourImporter() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImportTours = async () => {
    setLoading(true);
    setResult(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to import tours",
          variant: "destructive",
        });
        return;
      }

      const importResult = await importPingPeTours(user.id);
      setResult(importResult);

      if (importResult.success) {
        toast({
          title: "Tours imported successfully!",
          description: `Imported ${importResult.counts?.tours} official PingPe tours`,
        });
      } else {
        toast({
          title: "Import completed with errors",
          description: importResult.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearDemo = async () => {
    if (!confirm("Are you sure you want to delete all demo tours? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const clearResult = await clearDemoTours();
      
      if (clearResult.success) {
        toast({
          title: "Demo tours cleared",
          description: "All demo entries have been removed",
        });
        setResult(null);
      } else {
        toast({
          title: "Clear failed",
          description: clearResult.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Official PingPe Tours Importer
        </CardTitle>
        <CardDescription>
          Import 7 official tours with authentic content from PingPe documents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will import: 3-day Jungle Adventure, 4-day Jungle Experience, 4-day Back-to-Basic, 
            5-day Jungle Explorer, 5-day Back-to-Basic, 6-day Ultimate Back-to-Basic, and 
            Brownsberg & Ston Island Combo
          </AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button
            onClick={handleImportTours}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Plane className="mr-2 h-4 w-4" />
                Import Official Tours
              </>
            )}
          </Button>
          <Button
            onClick={handleClearDemo}
            disabled={loading}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {result && (
          <div className="space-y-2">
            <div className={`flex items-center gap-2 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.success ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="font-medium">{result.message}</span>
            </div>

            {result.counts && (
              <div className="bg-muted p-3 rounded-md space-y-1 text-sm">
                <div>Official Tours Imported: {result.counts.tours}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Includes: Standard tours (3, 4, 5 days), Back-to-Basic expeditions (4, 5, 6 days), 
                  and Combination tour (2 days)
                </div>
              </div>
            )}

            {result.errors && result.errors.length > 0 && (
              <div className="bg-destructive/10 p-3 rounded-md space-y-1 text-sm text-destructive">
                {result.errors.map((error, i) => (
                  <div key={i}>• {error}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2 text-sm">Tour Details:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>• 3-day: €285</div>
            <div>• 4-day: €360</div>
            <div>• 4-day Back-to-Basic: €380</div>
            <div>• 5-day: €385</div>
            <div>• 5-day Back-to-Basic: €410</div>
            <div>• 6-day Back-to-Basic: €430</div>
            <div>• Brownsberg Combo: €145</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
