import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Leaf, Heart, Users, Construction } from "lucide-react";

export default function Projects() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.jungleresortpingpe.com/" },
    { name: "Projects", url: "https://www.jungleresortpingpe.com/projects" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Community Projects & Sustainability | Jungle Resort PingPe"
        description="Learn about Jungle Resort PingPe's community development projects and sustainability initiatives supporting local villages in Upper Suriname. Conservation, education, and cultural preservation."
        keywords={["community projects", "sustainability suriname", "eco-tourism impact", "village development", "conservation projects", "cultural preservation"]}
        schemaType="WebPage"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <BreadcrumbNav
              items={[
                { label: "Home", href: "/" },
                { label: "Projects" },
              ]}
            />
            <div className="text-center mt-8">
              <Construction className="h-20 w-20 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Community Projects & Sustainability
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Supporting Local Communities Through Responsible Tourism
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-block p-6 bg-primary/10 rounded-full mb-6">
                <Leaf className="h-16 w-16 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">Coming Soon</h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                We're currently documenting our community projects and sustainability initiatives. 
                This page will soon feature detailed information about our efforts to support 
                local villages, preserve culture, and protect the pristine Suriname rainforest.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 rounded-lg bg-card border">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Community Development</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting education, health, and economic opportunities for village residents
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <Leaf className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Environmental Conservation</h3>
                  <p className="text-sm text-muted-foreground">
                    Protecting biodiversity and promoting sustainable practices in the rainforest
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <Heart className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Cultural Preservation</h3>
                  <p className="text-sm text-muted-foreground">
                    Helping maintain Saramaccan traditions and language for future generations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl font-bold">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Jungle Resort PingPe believes that tourism should benefit local communities 
                while preserving the natural environment and cultural heritage. Every tour 
                supports village development, and our solar-powered facilities demonstrate 
                our commitment to sustainable operations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Check back soon for updates on our specific projects, partnerships, and 
                measurable impact in Upper Suriname communities.
              </p>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground mb-6">
                Want to be notified when we launch our projects page? Get in touch with us!
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                >
                  Contact Us
                </a>
                <a
                  href="/experiences"
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  View Tours
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
