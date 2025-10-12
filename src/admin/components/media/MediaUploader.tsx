import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadMedia } from "@/hooks/useMediaLibrary";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  folder?: string;
  onUploadComplete?: () => void;
}

export function MediaUploader({ folder = "root", onUploadComplete }: MediaUploaderProps) {
  const uploadMutation = useUploadMedia();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const fileWithFolder = Object.assign(file, { folder });
        await uploadMutation.mutateAsync(fileWithFolder);
      }
      onUploadComplete?.();
    },
    [folder, uploadMutation, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
      "video/*": [".mp4", ".webm"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10485760, // 10MB
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50",
        uploadMutation.isPending && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {uploadMutation.isPending ? (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg font-medium">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium mb-1">
                {isDragActive ? "Drop files here" : "Drag & drop files here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (max 10MB per file)
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports: Images, Videos (MP4, WebM), PDFs
            </p>
          </>
        )}
      </div>
    </div>
  );
}