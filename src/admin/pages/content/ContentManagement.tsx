import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Loader2, Database, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { seedDemoContent, clearDemoContent, type SeedResult } from "@/admin/utils/seedDemoContent";
import { ContentImporter } from "@/admin/components/content/ContentImporter";

export default function ContentManagement() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);

  const handleSeedDemo = async () => {
    setLoading(true);
    setResult(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to seed content",
          variant: "destructive",
        });
        return;
      }

      const seedResult = await seedDemoContent(user.id);
      setResult(seedResult);

      if (seedResult.success) {
        toast({
          title: "Content seeded successfully!",
          description: `Created ${Object.values(seedResult.counts || {}).reduce((a, b) => a + b, 0)} demo items`,
        });
      } else {
        toast({
          title: "Seeding completed with errors",
          description: seedResult.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Seeding failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearDemo = async () => {
    if (!confirm("Are you sure you want to delete all demo content? This cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const clearResult = await clearDemoContent();
      
      if (clearResult.success) {
        toast({
          title: "Demo content cleared",
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
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Content Management</h1>
        <p className="text-muted-foreground">
          Populate your database with demo content or import authentic PingPe data
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Demo content is marked with "(Demo)" in titles. All images are sourced from official PingPe websites:
          futureproofpingpe.com and jungleresortpingpe.com
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Demo Content Seeder
            </CardTitle>
            <CardDescription>
              Quickly populate your database with sample properties, experiences, and blog posts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleSeedDemo}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Seed Demo Content
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
                    <div>Properties: {result.counts.properties}</div>
                    <div>Experiences: {result.counts.experiences}</div>
                    <div>Transport: {result.counts.transport}</div>
                    <div>Packages: {result.counts.packages}</div>
                    <div>Blog Posts: {result.counts.blog_posts}</div>
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
          </CardContent>
        </Card>

        <ContentImporter />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Collection Guide</CardTitle>
          <CardDescription>
            Follow these steps to replace demo content with authentic PingPe information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold mb-1">1. Gather Photos</h3>
              <p className="text-sm text-muted-foreground">
                Upload high-resolution photos to Media Library. Organize into folders: stays, experiences, transport, packages
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">2. Update Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                Verify phone (+597 8858525), email, and address in Settings → General
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">3. Replace Listings</h3>
              <p className="text-sm text-muted-foreground">
                Edit each demo entry with authentic details, pricing, and descriptions. Link real photos from Media Library
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">4. Add Real Testimonials</h3>
              <p className="text-sm text-muted-foreground">
                Collect guest feedback and add genuine reviews to build trust
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">5. Write Blog Content</h3>
              <p className="text-sm text-muted-foreground">
                Create authentic stories about PingPe, tours, and local culture
              </p>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              See <code>docs/CONTENT_COLLECTION_GUIDE.md</code> for detailed instructions and templates
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
