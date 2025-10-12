import { useState } from "react";
import { MediaFile, useDeleteMedia } from "@/hooks/useMediaLibrary";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, FileText, Video, Image as ImageIcon, Check } from "lucide-react";
import { format } from "date-fns";

interface MediaGridProps {
  files: MediaFile[];
  onSelect?: (file: MediaFile) => void;
  selectedId?: string;
  selectable?: boolean;
}

export function MediaGrid({ files, onSelect, selectedId, selectable }: MediaGridProps) {
  const [deleteFile, setDeleteFile] = useState<MediaFile | null>(null);
  const deleteMutation = useDeleteMedia();

  const handleDelete = () => {
    if (deleteFile) {
      deleteMutation.mutate(deleteFile);
      setDeleteFile(null);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return ImageIcon;
    if (fileType.startsWith("video/")) return Video;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {files.map((file) => {
          const Icon = getFileIcon(file.file_type);
          const isSelected = selectable && selectedId === file.id;

          return (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger>
                <div
                  onClick={() => selectable && onSelect?.(file)}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectable ? "cursor-pointer hover:border-primary" : ""
                  } ${isSelected ? "border-primary ring-2 ring-primary" : "border-border"}`}
                >
                  {file.file_type.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.alt_text || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Icon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-white/80 text-xs">
                        {formatFileSize(file.file_size)} • {format(new Date(file.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => window.open(file.url, "_blank")}>
                  View Full Size
                </ContextMenuItem>
                <ContextMenuItem onClick={() => navigator.clipboard.writeText(file.url)}>
                  Copy URL
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => setDeleteFile(file)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>

      <AlertDialog open={deleteFile !== null} onOpenChange={() => setDeleteFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteFile?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}