import { PageSection } from "@/hooks/usePages";

interface PageRendererProps {
  sections: PageSection[];
}

function HeroSection({ content }: { content: any }) {
  return (
    <section className="relative py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{content.title || "Hero Title"}</h1>
          <p className="text-xl text-muted-foreground mb-8">{content.subtitle || ""}</p>
          {content.cta_text && (
            <a
              href={content.cta_link || "#"}
              className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
            >
              {content.cta_text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function ContentSection({ content }: { content: any }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          {content.heading && <h2>{content.heading}</h2>}
          {content.text && <div dangerouslySetInnerHTML={{ __html: content.text }} />}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ content }: { content: any }) {
  const images = content.images || [];
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {content.heading && (
          <h2 className="text-3xl font-bold text-center mb-12">{content.heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img: any, idx: number) => (
            <div key={idx} className="aspect-video rounded-lg overflow-hidden">
              <img
                src={img.url || "/placeholder.svg"}
                alt={img.alt || `Gallery image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ content }: { content: any }) {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.heading || "Ready to Get Started?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">{content.text || ""}</p>
          {content.button_text && (
            <a
              href={content.button_link || "#"}
              className="inline-block px-8 py-3 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition"
            >
              {content.button_text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ content }: { content: any }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            {content.heading || "Get in Touch"}
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={5}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Your message"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              {content.button_text || "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function PageRenderer({ sections }: PageRendererProps) {
  return (
    <div>
      {sections
        .filter((section) => section.is_visible)
        .sort((a, b) => a.position - b.position)
        .map((section) => {
          switch (section.type) {
            case "hero":
              return <HeroSection key={section.id} content={section.content} />;
            case "content":
              return <ContentSection key={section.id} content={section.content} />;
            case "gallery":
              return <GallerySection key={section.id} content={section.content} />;
            case "cta":
              return <CTASection key={section.id} content={section.content} />;
            case "contact":
              return <ContactSection key={section.id} content={section.content} />;
            default:
              return null;
          }
        })}
    </div>
  );
}
