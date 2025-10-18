import { useParams, Link } from "react-router-dom";
import { useBlogPost, useRelatedPosts } from "@/hooks/useBlog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Facebook, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useBlogPost(slug!);
  const { data: relatedPosts } = useRelatedPosts(post?.id || "", post?.category_id);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seoTitle = post.seo_meta?.title || post.title;
  const seoDescription = post.seo_meta?.description || post.excerpt || "";
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const breadcrumbs = [
    { name: "Home", url: "https://www.jungleresortpingpe.com/" },
    { name: "Blog", url: "https://www.jungleresortpingpe.com/blog" },
    { name: post.title, url: currentUrl }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${seoTitle} - PingPe Blog`}
        description={seoDescription}
        image={post.featured_image}
        schemaType="BlogPosting"
        author={{ name: "PingPe Resort Team" }}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        canonicalUrl={currentUrl}
        url={currentUrl}
        type="article"
        keywords={[
          "pingpe blog",
          "suriname travel",
          "jungle resort",
          post.blog_categories?.name || "",
          ...(post.seo_meta?.keywords || [])
        ].filter(Boolean)}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />

      <article className="flex-1">
        {/* Hero */}
        {post.featured_image && (
          <div className="relative h-[500px] w-full mt-20">
            <OptimizedImage
              src={post.featured_image}
              alt={post.title}
              priority={true}
              width={1920}
              height={500}
              sizes="100vw"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-6 bg-background/80 backdrop-blur">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <div className="bg-card rounded-xl p-8 md:p-12 shadow-lg">
              {post.blog_categories && (
                <span className="text-sm font-medium text-primary mb-4 inline-block">
                  {post.blog_categories.name}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
                </div>
              </div>

              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />

              {/* Social Share */}
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Share on Twitter"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Share on Facebook"
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Share on LinkedIn"
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="container mx-auto px-4 pb-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all"
                  >
                    {relatedPost.featured_image && (
                      <div className="aspect-video overflow-hidden">
                        <OptimizedImage
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          width={400}
                          height={225}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {relatedPost.blog_categories && (
                        <span className="text-xs font-medium text-primary mb-2 inline-block">
                          {relatedPost.blog_categories.name}
                        </span>
                      )}
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}