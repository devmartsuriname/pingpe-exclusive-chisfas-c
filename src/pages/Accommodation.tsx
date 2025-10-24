import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Sun, Wifi, Coffee, TreePine, Home, Users } from "lucide-react";

export default function Accommodation() {
  const breadcrumbs = [
    { name: "Home", url: "https://www.jungleresortpingpe.com/" },
    { name: "Accommodation", url: "https://www.jungleresortpingpe.com/accommodation" }
  ];

  return (
    <>
      <SEO
        title="Accommodation | Jungle Resort PingPe - Eco-Lodges in Suriname Rainforest"
        description="Stay in our eco-friendly lodges at Jungle Resort PingPe. Six spacious lodges with private facilities, solar power, and stunning river views in the heart of Upper Suriname's pristine jungle."
        keywords={["jungle lodge suriname", "eco accommodation", "pingpe lodges", "rainforest resort", "solar powered resort", "river view lodges", "sustainable tourism"]}
        schemaType="WebPage"
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Jungle Resort PingPe Accommodation
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Comfortable eco-lodges in the heart of Suriname's pristine rainforest
            </p>
          </div>
        </section>

        {/* Facilities Overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">About the Resort</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Jungle Resort PingPe is a small-scale retreat equipped with all basic facilities. 
                  Located on an island in the magnificent Boven-Suriname River, our resort offers 
                  the perfect blend of comfort and authentic jungle experience.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-card border">
                  <Home className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Six Spacious Lodges</h3>
                  <p className="text-muted-foreground">
                    Each lodge features its own private shower and toilet. Simply furnished but 
                    comfortable, with verandas offering stunning river views. Morning coffee and 
                    tea service included.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <Users className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Flexible Capacity</h3>
                  <p className="text-muted-foreground">
                    Lodges accommodate up to 4 persons each, with arrangements depending on 
                    group composition. Hammock setups also available for a more traditional 
                    jungle experience.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <Sun className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Solar Energy</h3>
                  <p className="text-muted-foreground">
                    Powered by solar panels providing evening lighting and charging stations for 
                    electronic devices. We're committed to sustainable, eco-friendly operations.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-card border">
                  <Coffee className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Restaurant & Bar</h3>
                  <p className="text-muted-foreground">
                    Enjoy delicious meals in our restaurant with bar. Our kitchen prepares 
                    authentic dishes using local ingredients, served in a relaxed atmosphere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Resort Features</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6">
                  <TreePine className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Riverside Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Wake up to river views from your veranda
                  </p>
                </div>

                <div className="text-center p-6">
                  <Wifi className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Device Charging</h3>
                  <p className="text-sm text-muted-foreground">
                    Solar-powered charging for cameras and phones
                  </p>
                </div>

                <div className="text-center p-6">
                  <Coffee className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Morning Service</h3>
                  <p className="text-sm text-muted-foreground">
                    Coffee and tea delivered to your veranda daily
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Relaxation Areas */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Relaxation & Common Areas</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Beyond your private lodge, the resort offers various spaces to relax and connect 
                  with nature. Enjoy the peaceful island atmosphere, swim in the pristine river, 
                  or find a quiet spot to read and observe the surrounding jungle.
                </p>
                <p className="leading-relaxed">
                  Separate shower and toilet facilities are available near the restaurant area. 
                  Multiple seating areas throughout the resort provide perfect vantage points for 
                  bird watching, enjoying sunsets, or socializing with fellow travelers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Note */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Sun className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Sustainable Tourism</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Our solar energy system reflects our commitment to sustainable tourism. 
                We believe in experiencing nature's beauty while preserving it for future 
                generations. Join us in this eco-friendly approach to jungle adventures.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Jungle?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Book your stay at Jungle Resort PingPe and immerse yourself in the authentic 
              rainforest experience
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/experiences"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                View Tours
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
