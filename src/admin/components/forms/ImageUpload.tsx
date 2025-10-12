import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  bucketName?: string;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  bucketName = "inventory_images"
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const newImageUrls: string[] = [];

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 5MB limit`,
            variant: "destructive",
          });
          continue;
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }

    onImagesChange([...images, ...newImageUrls]);
    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    // Extract file path from URL
    const urlParts = imageUrl.split(`/${bucketName}/`);
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      
      // Delete from storage
      await supabase.storage.from(bucketName).remove([filePath]);
    }

    onImagesChange(images.filter((img) => img !== imageUrl));
  };

  return (
    <div className="space-y-4">
      <Label>Images</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group aspect-square rounded-lg border overflow-hidden">
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(imageUrl)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="text-xs">Add Image</span>
              </>
            )}
          </button>
        )}
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-muted-foreground">
        Upload up to {maxImages} images. Max 5MB per image. Supported formats: JPG, PNG, WebP.
      </p>
    </div>
  );
}
