import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import slugify from "slugify";
import { ArrowLeft } from "lucide-react";
import { useCreatePage } from "@/hooks/usePages";
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

const pageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required"),
  status: z.enum(["draft", "published"]),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
  seo_keywords: z.string().optional(),
  seo_image: z.string().url().optional().or(z.literal("")),
});

type PageFormData = z.infer<typeof pageSchema>;

export default function PageCreate() {
  const navigate = useNavigate();
  const createPage = useCreatePage();
  const [autoSlug, setAutoSlug] = useState(true);

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "draft",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
      seo_image: "",
    },
  });

  const handleTitleChange = (title: string) => {
    form.setValue("title", title);
    if (autoSlug) {
      const slug = slugify(title, { lower: true, strict: true });
      form.setValue("slug", slug);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    const seoMeta: any = {};
    if (data.seo_title) seoMeta.title = data.seo_title;
    if (data.seo_description) seoMeta.description = data.seo_description;
    if (data.seo_keywords) seoMeta.keywords = data.seo_keywords;
    if (data.seo_image) seoMeta.image = data.seo_image;

    const result = await createPage.mutateAsync({
      title: data.title,
      slug: data.slug,
      status: data.status,
      seo_meta: seoMeta,
    });

    navigate(`/admin/pages/edit/${result.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/pages")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Page</h1>
          <p className="text-muted-foreground">Create a new custom page</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Page Details</CardTitle>
                  <CardDescription>Basic information about your page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="About Us"
                            {...field}
                            onChange={(e) => handleTitleChange(e.target.value)}
                          />
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
                          <div className="flex gap-2">
                            <Input
                              placeholder="about-us"
                              {...field}
                              onChange={(e) => {
                                setAutoSlug(false);
                                field.onChange(e);
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setAutoSlug(true)}
                            >
                              Auto
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel>Published</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value === "published"}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? "published" : "draft")
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                  <CardDescription>Search engine optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input placeholder="SEO title (max 60 chars)" {...field} />
                        </FormControl>
                        <FormMessage />
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
                          <Textarea
                            placeholder="SEO description (max 160 chars)"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                          <Input placeholder="keyword1, keyword2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seo_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OG Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={createPage.isPending}>
              {createPage.isPending ? "Creating..." : "Create Page"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/pages")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
