import { useState } from "react";
import { useMediaFiles } from "@/hooks/useMediaLibrary";
import { MediaUploader } from "@/admin/components/media/MediaUploader";
import { MediaGrid } from "@/admin/components/media/MediaGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, FolderOpen } from "lucide-react";

export default function MediaLibrary() {
  const [folder, setFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  
  const { data: files, isLoading } = useMediaFiles(
    folder === "all" ? undefined : folder,
    searchQuery
  );

  const folders = ["root", "blog", "properties", "experiences", "packages"];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your images, videos, and documents</p>
        </div>
        <Button onClick={() => setShowUploader(!showUploader)}>
          {showUploader ? <FolderOpen className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
          {showUploader ? "View Library" : "Upload Files"}
        </Button>
      </div>

      {showUploader ? (
        <MediaUploader
          folder={folder === "all" ? "root" : folder}
          onUploadComplete={() => setShowUploader(false)}
        />
      ) : (
        <>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={folder} onValueChange={setFolder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Folders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folders.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            </div>
          ) : files && files.length > 0 ? (
            <MediaGrid files={files} />
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No files found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your first file to get started
              </p>
              <Button onClick={() => setShowUploader(true)}>
                Upload Files
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}