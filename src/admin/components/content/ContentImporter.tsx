import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileJson, Database } from "lucide-react";

export function ContentImporter() {
  const [importing, setImporting] = useState(false);
  const [jsonData, setJsonData] = useState("");

  const handleJsonImport = async (tableName: string) => {
    if (!jsonData.trim()) {
      toast({
        title: "No data provided",
        description: "Please paste JSON data to import",
        variant: "destructive",
      });
      return;
    }

    try {
      setImporting(true);
      const data = JSON.parse(jsonData);
      const items = Array.isArray(data) ? data : [data];

      const { error } = await supabase.from(tableName as any).insert(items as any);

      if (error) throw error;

      toast({
        title: "Import successful",
        description: `Imported ${items.length} item(s) to ${tableName}`,
      });
      setJsonData("");
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleCsvImport = (file: File, tableName: string) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        setImporting(true);
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());
        
        const data = lines.slice(1).map((line) => {
          const values = line.split(",");
          const obj: any = {};
          headers.forEach((header, i) => {
            obj[header] = values[i]?.trim();
          });
          return obj;
        }).filter((obj) => Object.values(obj).some((v) => v));

        const { error } = await supabase.from(tableName as any).insert(data as any);
        if (error) throw error;

        toast({
          title: "CSV import successful",
          description: `Imported ${data.length} items to ${tableName}`,
        });
      } catch (error: any) {
        toast({
          title: "CSV import failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const tables = [
    { name: "properties", label: "Properties" },
    { name: "experiences", label: "Experiences" },
    { name: "transport", label: "Transport" },
    { name: "packages", label: "Packages" },
    { name: "blog_posts", label: "Blog Posts" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Content Importer
        </CardTitle>
        <CardDescription>
          Import content in bulk from JSON or CSV files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json">
              <FileJson className="h-4 w-4 mr-2" />
              JSON Import
            </TabsTrigger>
            <TabsTrigger value="csv">
              <Database className="h-4 w-4 mr-2" />
              CSV Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Paste JSON data (array or single object)
              </label>
              <Textarea
                placeholder='[{"title": "Demo Property", "price_per_night": 85, ...}]'
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tables.map((table) => (
                <Button
                  key={table.name}
                  onClick={() => handleJsonImport(table.name)}
                  disabled={importing}
                  variant="outline"
                >
                  Import to {table.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a CSV file with column headers matching database fields
              </p>
              {tables.map((table) => (
                <div key={table.name} className="flex items-center gap-2">
                  <label className="text-sm font-medium flex-1">{table.label}</label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCsvImport(file, table.name);
                    }}
                    disabled={importing}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
