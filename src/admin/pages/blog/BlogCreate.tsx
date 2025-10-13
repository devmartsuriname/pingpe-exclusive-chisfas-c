import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBlogPost, useBlogCategories, useAssignTag } from "@/hooks/useBlog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TagSelector } from "@/components/blog/TagSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/editor/RichTextEditor";
import { ImageUpload } from "@/admin/components/forms/ImageUpload";
import { ArrowLeft, Save } from "lucide-react";
import slugify from "slugify";

export default function BlogCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateBlogPost();
  const assignTag = useAssignTag();
  const { data: categories } = useBlogCategories();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    body: "",
    excerpt: "",
    featured_image: "",
    category_id: "",
    status: "draft" as "draft" | "published",
    seo_meta: {
      title: "",
      description: "",
      keywords: "",
    },
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: slugify(title, { lower: true, strict: true }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const post = await createMutation.mutateAsync(formData);
    
    // Assign tags
    for (const tagId of selectedTags) {
      await assignTag.mutateAsync({ postId: post.id, tagId });
    }
    
    navigate("/admin/blog");
  };

  const handlePublish = async () => {
    const post = await createMutation.mutateAsync({ ...formData, status: "published" });
    
    // Assign tags
    for (const tagId of selectedTags) {
      await assignTag.mutateAsync({ postId: post.id, tagId });
    }
    
    navigate("/admin/blog");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate("/admin/blog")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Create Blog Post</h1>
            <p className="text-muted-foreground">Write and publish your content</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish}>Publish</Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="post-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Body</Label>
                <RichTextEditor
                  content={formData.body}
                  onChange={(body) => setFormData({ ...formData, body })}
                  placeholder="Write your post content..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />
              </div>

              <div>
                <Label>Featured Image</Label>
                <ImageUpload
                  images={formData.featured_image ? [formData.featured_image] : []}
                  onImagesChange={(images) =>
                    setFormData({ ...formData, featured_image: images[0] || "" })
                  }
                  maxImages={1}
                  bucketName="inventory_images"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo-title">Meta Title</Label>
                <Input
                  id="seo-title"
                  value={formData.seo_meta.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo_meta: { ...formData.seo_meta, title: e.target.value },
                    })
                  }
                  placeholder="SEO title..."
                />
              </div>

              <div>
                <Label htmlFor="seo-description">Meta Description</Label>
                <Textarea
                  id="seo-description"
                  value={formData.seo_meta.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo_meta: { ...formData.seo_meta, description: e.target.value },
                    })
                  }
                  placeholder="SEO description..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="seo-keywords">Keywords</Label>
                <Input
                  id="seo-keywords"
                  value={formData.seo_meta.keywords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo_meta: { ...formData.seo_meta, keywords: e.target.value },
                    })
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}