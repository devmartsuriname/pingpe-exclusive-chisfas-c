import { useState } from "react";
import { useSettings } from "@/admin/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function LogoUploadForm() {
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const platformLogo = getSetting("platform_logo")?.value || "";
  const platformFavicon = getSetting("platform_favicon")?.value || "";

  const handleFileUpload = async (
    file: File,
    settingKey: string,
    settingDescription: string
  ) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${settingKey}-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from("media_library")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("media_library")
        .getPublicUrl(filePath);

      // Save to settings
      updateSetting({
        key: settingKey,
        value: urlData.publicUrl,
        description: settingDescription,
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = (settingKey: string) => {
    updateSetting({
      key: settingKey,
      value: "",
      description: `Platform ${settingKey.split("_")[1]}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Platform Logo</Label>
        <div className="flex items-center gap-4">
          {platformLogo ? (
            <div className="relative">
              <img
                src={platformLogo}
                alt="Platform logo"
                className="h-20 w-auto rounded border border-border"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => handleRemoveLogo("platform_logo")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-20 w-32 rounded border border-dashed border-border flex items-center justify-center bg-muted/30">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, "platform_logo", "Platform main logo");
                }
              }}
              disabled={uploading || isUpdating}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: PNG or SVG, max 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Favicon Upload */}
      <div className="space-y-2">
        <Label htmlFor="favicon">Favicon</Label>
        <div className="flex items-center gap-4">
          {platformFavicon ? (
            <div className="relative">
              <img
                src={platformFavicon}
                alt="Favicon"
                className="h-12 w-12 rounded border border-border"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => handleRemoveLogo("platform_favicon")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="h-12 w-12 rounded border border-dashed border-border flex items-center justify-center bg-muted/30">
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1">
            <Input
              id="favicon"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file, "platform_favicon", "Platform favicon");
                }
              }}
              disabled={uploading || isUpdating}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 32x32px or 64x64px, ICO or PNG
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
