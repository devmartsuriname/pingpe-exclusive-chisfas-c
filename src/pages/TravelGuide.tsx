import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Book, Compass, Heart, Shield, Sun, Utensils } from "lucide-react";

export default function TravelGuide() {
  const guides = [
    {
      icon: Book,
      title: "Essential Travel Tips",
      description: "Learn about visa requirements, currency, language basics, and local customs before you go.",
    },
    {
      icon: Shield,
      title: "Safety & Health",
      description: "Stay safe with our comprehensive guide on vaccinations, travel insurance, and emergency contacts.",
    },
    {
      icon: Utensils,
      title: "Food & Dining",
      description: "Discover local cuisine, popular dishes, dining etiquette, and the best places to eat.",
    },
    {
      icon: Sun,
      title: "Best Time to Visit",
      description: "Find out about weather patterns, peak seasons, and the ideal times to visit different regions.",
    },
    {
      icon: Compass,
      title: "Getting Around",
      description: "Navigate like a local with tips on transportation options, driving rules, and navigation apps.",
    },
    {
      icon: Heart,
      title: "Cultural Etiquette",
      description: "Respect local customs, traditions, and social norms to ensure a positive travel experience.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Travel Guide | PingPe - Tips & Advice</title>
        <meta
          name="description"
          content="Get expert travel advice and tips from PingPe. Learn about destinations, safety, culture, and more to make your trip unforgettable."
        />
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Travel Guide
              </h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to know for a safe, enjoyable, and memorable trip
              </p>
            </div>
          </div>
        </section>

        {/* Guide Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {guides.map((guide, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <guide.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {guide.title}
                  </h3>
                  <p className="text-muted-foreground">{guide.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Tips Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
                Top Travel Tips for Suriname
              </h2>
              <div className="space-y-6">
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    1. Pack for the Rainforest
                  </h3>
                  <p className="text-muted-foreground">
                    Bring lightweight, quick-dry clothing, insect repellent, waterproof gear, and sturdy hiking shoes. The tropical climate means high humidity year-round.
                  </p>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    2. Respect Indigenous Communities
                  </h3>
                  <p className="text-muted-foreground">
                    When visiting indigenous villages, always ask permission before taking photos. Support local artisans by purchasing authentic handicrafts directly from communities.
                  </p>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    3. Stay Connected Safely
                  </h3>
                  <p className="text-muted-foreground">
                    Internet coverage can be limited in remote areas. Download offline maps and keep emergency contact numbers saved. Let someone know your itinerary when heading into the jungle.
                  </p>
                </div>
                <div className="bg-background rounded-lg p-6 border border-border">
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    4. Try Local Cuisine
                  </h3>
                  <p className="text-muted-foreground">
                    Don't miss Surinamese favorites like pom, roti, and bakabana. The cuisine is a delicious blend of African, Indonesian, Indian, and Chinese influences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-primary/10 rounded-lg p-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Ready to Start Planning?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Use our platform to book stays, experiences, and transportation for your perfect trip
              </p>
              <a
                href="/stays"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Listings
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
