import { useParams, Navigate } from "react-router-dom";
import { usePage } from "@/hooks/usePages";
import PageRenderer from "@/components/pages/PageRenderer";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = usePage(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return <Navigate to="/404" replace />;
  }

  if (page.status !== "published") {
    return <Navigate to="/404" replace />;
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  
  const breadcrumbs = [
    { name: "Home", url: "https://www.jungleresortpingpe.com/" },
    { name: page.title, url: currentUrl }
  ];

  // Ensure keywords is always an array
  const keywords = Array.isArray(page.seo_meta?.keywords) 
    ? page.seo_meta.keywords 
    : [page.title, "pingpe", "suriname"];

  return (
    <>
      <SEO
        title={page.seo_meta?.title || page.title}
        description={page.seo_meta?.description || `${page.title} - PingPe`}
        image={page.seo_meta?.image}
        schemaType="WebPage"
        datePublished={page.created_at}
        dateModified={page.updated_at}
        canonicalUrl={currentUrl}
        url={currentUrl}
        keywords={keywords}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <PageRenderer sections={page.page_sections || []} />
    </>
  );
}
