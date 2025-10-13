import SEO from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Press() {
  const pressReleases = [
    {
      title: "PingPe Expands Operations to South America",
      date: "October 15, 2025",
      excerpt: "Leading travel platform announces expansion into new markets with focus on sustainable tourism...",
    },
    {
      title: "PingPe Reaches 100,000 Active Users Milestone",
      date: "September 8, 2025",
      excerpt: "The platform celebrates significant growth in user base and booking volume...",
    },
    {
      title: "Partnership with Indigenous Communities Announced",
      date: "August 22, 2025",
      excerpt: "PingPe launches initiative to promote authentic cultural experiences and support local communities...",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Press & Media | PingPe - News & Resources"
        description="Access PingPe press releases, media kit, and contact information for media inquiries."
        url="https://www.jungleresortpingpe.com/press"
      />
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Press & Media
              </h1>
              <p className="text-xl text-muted-foreground">
                Latest news, press releases, and media resources about PingPe
              </p>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground mb-12">
              Recent Press Releases
            </h2>
            <div className="max-w-4xl space-y-6">
              {pressReleases.map((release, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {release.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {release.date}
                      </p>
                      <p className="text-muted-foreground mb-4">
                        {release.excerpt}
                      </p>
                      <Button variant="outline" size="sm">
                        Read Full Release
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Kit */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Media Kit
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Company Logos
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Download our official logos in various formats and sizes
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Logos
                  </Button>
                </div>
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Brand Guidelines
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    View our comprehensive brand identity and usage guidelines
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Guidelines
                  </Button>
                </div>
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Product Screenshots
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    High-resolution screenshots of our platform and features
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Screenshots
                  </Button>
                </div>
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Company Information
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Fact sheet with company overview and key statistics
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Fact Sheet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-primary/10 rounded-lg p-12 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Media Inquiries
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                For press inquiries, interview requests, or additional information, please contact our media team.
              </p>
              <div className="space-y-2 mb-8">
                <p className="text-foreground">
                  <strong>Email:</strong> press@pingpe.com
                </p>
                <p className="text-foreground">
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
              </div>
              <Button size="lg" asChild>
                <a href="mailto:press@pingpe.com">Contact Media Team</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
