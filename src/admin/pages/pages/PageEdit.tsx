import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, Plus, GripVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  usePage,
  useUpdatePage,
  usePageSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useReorderSections,
  PageSection,
} from "@/hooks/usePages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["draft", "published"]),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  seo_image: z.string().optional(),
});

type PageFormData = z.infer<typeof pageSchema>;

const SECTION_TYPES = [
  { value: "hero", label: "Hero Section" },
  { value: "content", label: "Content Block" },
  { value: "gallery", label: "Image Gallery" },
  { value: "cta", label: "Call to Action" },
  { value: "contact", label: "Contact Form" },
];

function SortableSection({
  section,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  section: PageSection;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-card border rounded-lg"
    >
      <button {...attributes} {...listeners} className="cursor-grab hover:text-primary">
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1">
        <p className="font-medium">{section.type}</p>
        <p className="text-sm text-muted-foreground">Position: {section.position}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleVisibility}
          title={section.is_visible ? "Hide section" : "Show section"}
        >
          {section.is_visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function PageEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionType, setSectionType] = useState("hero");
  const [sectionContent, setSectionContent] = useState("");

  const { data: page, isLoading: pageLoading } = usePage(id || "");
  const { data: sections = [], isLoading: sectionsLoading } = usePageSections(id || "");
  const updatePage = useUpdatePage();
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const reorderSections = useReorderSections();

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    values: page
      ? {
          title: page.title,
          slug: page.slug,
          status: page.status,
          seo_title: page.seo_meta?.title || "",
          seo_description: page.seo_meta?.description || "",
          seo_keywords: page.seo_meta?.keywords || "",
          seo_image: page.seo_meta?.image || "",
        }
      : undefined,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const reordered = arrayMove(sections, oldIndex, newIndex);
      reorderSections.mutate({ pageId: id!, sections: reordered });
    }
  };

  const handleAddSection = () => {
    try {
      const content = sectionContent ? JSON.parse(sectionContent) : {};
      createSection.mutate({
        page_id: id!,
        type: sectionType,
        content,
        position: sections.length,
      });
      setSectionContent("");
    } catch (error) {
      alert("Invalid JSON content");
    }
  };

  const handleEditSection = (section: PageSection) => {
    setEditingSectionId(section.id);
    setSectionType(section.type);
    setSectionContent(JSON.stringify(section.content, null, 2));
  };

  const handleSaveSection = () => {
    if (!editingSectionId) return;
    try {
      const content = sectionContent ? JSON.parse(sectionContent) : {};
      updateSection.mutate(
        { id: editingSectionId, type: sectionType, content },
        {
          onSuccess: () => {
            setEditingSectionId(null);
            setSectionContent("");
          },
        }
      );
    } catch (error) {
      alert("Invalid JSON content");
    }
  };

  const handleToggleVisibility = (section: PageSection) => {
    updateSection.mutate({
      id: section.id,
      is_visible: !section.is_visible,
    });
  };

  const onSubmit = (data: PageFormData) => {
    const seoMeta: any = {};
    if (data.seo_title) seoMeta.title = data.seo_title;
    if (data.seo_description) seoMeta.description = data.seo_description;
    if (data.seo_keywords) seoMeta.keywords = data.seo_keywords;
    if (data.seo_image) seoMeta.image = data.seo_image;

    updatePage.mutate({
      id: id!,
      title: data.title,
      slug: data.slug,
      status: data.status,
      seo_meta: seoMeta,
    });
  };

  if (pageLoading || sectionsLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/pages")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Edit Page</h1>
          <p className="text-muted-foreground">{page?.title}</p>
        </div>
        <Button variant="outline" asChild>
          <a href={`/p/${page?.slug}`} target="_blank" rel="noopener noreferrer">
            Preview
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={updatePage.isPending}>
                    {updatePage.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Page Sections</CardTitle>
                  <CardDescription>Drag to reorder sections</CardDescription>
                </div>
                <Dialog>
                  <Button asChild>
                    <DialogTrigger>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </DialogTrigger>
                  </Button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Section</DialogTitle>
                      <DialogDescription>
                        Create a new section for this page
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Section Type</label>
                        <Select value={sectionType} onValueChange={setSectionType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SECTION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Content (JSON)</label>
                        <Textarea
                          placeholder='{"title": "Welcome", "subtitle": "..."}'
                          value={sectionContent}
                          onChange={(e) => setSectionContent(e.target.value)}
                          rows={8}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddSection}>Add Section</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={sections} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <SortableSection
                        key={section.id}
                        section={section}
                        onEdit={() => handleEditSection(section)}
                        onDelete={() =>
                          deleteSection.mutate({ id: section.id, page_id: id! })
                        }
                        onToggleVisibility={() => handleToggleVisibility(section)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {sections.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No sections yet. Add your first section!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel>Published</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value === "published"}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? "published" : "draft");
                            form.handleSubmit(onSubmit)();
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seo_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!editingSectionId} onOpenChange={() => setEditingSectionId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Section Type</label>
              <Select value={sectionType} onValueChange={setSectionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Content (JSON)</label>
              <Textarea
                value={sectionContent}
                onChange={(e) => setSectionContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSectionId(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSection}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
