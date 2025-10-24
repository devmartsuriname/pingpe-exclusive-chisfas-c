import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageHero } from "@/components/sections/PageHero";
import { Users, Heart, Home, TreePine, School, Radio } from "lucide-react";

export default function Village() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.jungleresortpingpe.com/" },
    { name: "PingPe Village", url: "https://www.jungleresortpingpe.com/village" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="PingPe Village | Authentic Saramaccan Maroon Culture in Suriname"
        description="Discover PingPe Village - an authentic Maroon settlement in Upper Suriname where 200 inhabitants preserve traditional Saramaccan culture, customs, and self-sustaining lifestyle passed down from West African ancestors."
        keywords={["pingpe village", "saramaccan culture", "maroon village suriname", "authentic village", "traditional culture", "west african heritage", "upper suriname villages"]}
        schemaType="Place"
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />
      
      <main className="flex-1">
        <PageHero
          title="PingPe Village"
          subtitle="Heart of Saramaccan Culture in Upper Suriname"
          backgroundImage="/demo-content/gallery-1.jpg"
          breadcrumbItems={[{ label: "Village" }]}
        />

        {/* Introduction */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl font-bold mb-4">Warm Welcome to PingPe</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    In the village, you'll be warmly and heartily welcomed by the residents, who 
                    will quickly teach you your first Saramaccan words through their friendly greetings. 
                    PingPe is an authentic Maroon village where approximately 200 inhabitants live.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-8">
                <Users className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-3xl font-bold mb-4">Maroon Heritage</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Maroons are descendants of escaped slaves who originally came from West Africa. 
                    In the villages, they have successfully preserved the culture of their ancestors. 
                    This rich cultural heritage is visible in their language, traditions, crafts, 
                    and daily way of life.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 rounded-lg bg-card border">
                  <TreePine className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Self-Sustaining Lifestyle</h3>
                  <p className="text-muted-foreground">
                    For their daily livelihood, villagers rely primarily on nature's bounty: 
                    hunting, fishing, agriculture, timber, and medicinal plants. This sustainable 
                    way of living has been passed down through generations.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <Home className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Modern Supplies</h3>
                  <p className="text-muted-foreground">
                    From Paramaribo, supplies such as clothing, kitchenware, tools, rice, 
                    gasoline, and outboard motors are brought in. This blend of traditional 
                    and modern creates a unique community dynamic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authentic Experience */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Authentic Village Experience</h2>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  When visiting the villages of PingPe and neighboring Semoisie, you'll experience 
                  the authentic way of life, atmosphere, and culture firsthand. Because tourism 
                  has not yet penetrated on a large scale, the traditional village culture has 
                  remained beautifully preserved.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-6">
                    <School className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Local School</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit the elementary school where children from both villages receive their 
                      education
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <Radio className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Community Radio</h3>
                    <p className="text-sm text-muted-foreground">
                      The local radio station connects villages and shares news across the region
                    </p>
                  </div>

                  <div className="text-center p-6">
                    <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Daily Life</h3>
                    <p className="text-sm text-muted-foreground">
                      Observe traditional activities: washing clothes by the river, fishing, 
                      and children playing in the water
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cultural Activities */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Village Activities</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-background border">
                  <h3 className="text-xl font-semibold mb-3">Cultural Evenings</h3>
                  <p className="text-muted-foreground mb-3">
                    Experience traditional Saramaccan performances featuring song, dance, and rhythm. 
                    Village women become increasingly enthusiastic as guests join in the dancing!
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Available with groups of 4 or more persons
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-background border">
                  <h3 className="text-xl font-semibold mb-3">Village Walks</h3>
                  <p className="text-muted-foreground mb-3">
                    Guided walks through PingPe and Semoisie villages allow you to meet residents, 
                    see traditional houses, learn about daily activities, and understand the 
                    community structure.
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Included in all tour packages
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-background border">
                  <h3 className="text-xl font-semibold mb-3">Traditional Crafts</h3>
                  <p className="text-muted-foreground">
                    Observe local artisans creating traditional items using techniques passed 
                    down through generations. From wood carving to textile patterns, each craft 
                    tells a story of cultural preservation.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-background border">
                  <h3 className="text-xl font-semibold mb-3">Language & Customs</h3>
                  <p className="text-muted-foreground">
                    Learn basic Saramaccan phrases and understand local customs. Your guide 
                    will explain the significance of various traditions and how they connect 
                    to West African roots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Neighboring Semoisie */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">PingPe & Semoisie</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                PingPe and neighboring Semoisie village work together as a close-knit community. 
                Children from both villages attend the same school, families intermarry, and 
                cultural celebrations are shared events. This partnership strengthens both 
                communities while preserving their unique identities.
              </p>
              <div className="p-6 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground italic">
                  "The warm hospitality and genuine cultural experience in PingPe and Semoisie 
                  create unforgettable memories. Here, tourism doesn't disrupt tradition - it 
                  celebrates and preserves it."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience Authentic Maroon Culture</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Visit PingPe and Semoisie villages as part of your jungle tour and connect with 
              living West African heritage in Upper Suriname
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/experiences"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                View Tours
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
