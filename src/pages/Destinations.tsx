import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Destinations() {
  const destinations = [
    {
      name: "Paramaribo",
      country: "Suriname",
      description: "Historic capital city with Dutch colonial architecture",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      properties: 45,
      experiences: 28,
      rating: 4.8,
    },
    {
      name: "Brokopondo",
      country: "Suriname",
      description: "Stunning reservoir surrounded by pristine rainforest",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      properties: 12,
      experiences: 15,
      rating: 4.9,
    },
    {
      name: "Palumeu",
      country: "Suriname",
      description: "Remote jungle village offering authentic indigenous experiences",
      image: "https://images.unsplash.com/photo-1520037930326-35f42598a769",
      properties: 8,
      experiences: 20,
      rating: 5.0,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Destinations | PingPe - Explore Amazing Places</title>
        <meta
          name="description"
          content="Discover amazing destinations on PingPe. Explore cities, towns, and hidden gems with curated stays and experiences."
        />
      </Helmet>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Explore Destinations
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover unique places and unforgettable experiences around the world
              </p>
            </div>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {destinations.map((destination, idx) => (
                <div
                  key={idx}
                  className="group rounded-lg overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      {destination.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>{destination.properties} properties</span>
                      <span>{destination.experiences} experiences</span>
                    </div>
                    <Button className="w-full" asChild>
                      <a href="/stays">Explore {destination.name}</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Can't find your destination?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We're constantly adding new locations. Contact us to suggest a destination or become a host in your area.
              </p>
              <Button size="lg" asChild>
                <a href="/contact">Get in Touch</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
