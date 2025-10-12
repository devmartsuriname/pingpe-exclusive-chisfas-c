import { useState } from "react";
import { useMediaFiles } from "@/hooks/useMediaLibrary";
import { MediaUploader } from "@/admin/components/media/MediaUploader";
import { MediaGrid } from "@/admin/components/media/MediaGrid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  folder?: string;
}

export function MediaPicker({ open, onClose, onSelect, folder }: MediaPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  
  const { data: files, isLoading, refetch } = useMediaFiles(folder, searchQuery);

  const handleSelect = (fileId: string) => {
    setSelectedId(fileId);
  };

  const handleConfirm = () => {
    const selectedFile = files?.find((f) => f.id === selectedId);
    if (selectedFile) {
      onSelect(selectedFile.url);
      onClose();
      setSelectedId(undefined);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>
            Choose an image from your library or upload a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="library" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col min-h-0">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                </div>
              ) : files && files.length > 0 ? (
                <MediaGrid
                  files={files}
                  onSelect={(file) => handleSelect(file.id)}
                  selectedId={selectedId}
                  selectable
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No files found</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!selectedId}>
                Select
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1">
            <MediaUploader
              folder={folder}
              onUploadComplete={() => {
                refetch();
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}