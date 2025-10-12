import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/search/SearchBar";
import { ListingCard } from "@/components/cards/ListingCard";

const Index = () => {
  // Demo listings data
  const demoListings = [
    {
      id: "1",
      type: "stay" as const,
      title: "Riverside Eco-Lodge",
      subtitle: "Peaceful retreat on the Suriname River",
      location: "Boven Suriname",
      price: 85,
      images: ["/placeholder.svg"],
      rating: 4.8,
      reviewCount: 24,
      badges: ["Eco-Friendly", "Featured"],
      metadata: { guests: 4, bedrooms: 2 },
    },
    {
      id: "2",
      type: "experience" as const,
      title: "Rainforest Hiking Adventure",
      subtitle: "Guided trek through pristine jungle",
      location: "Central Suriname",
      price: 45,
      priceUnit: "person",
      images: ["/placeholder.svg"],
      rating: 4.9,
      reviewCount: 18,
      badges: ["Popular"],
      metadata: { duration: "4 hours", difficulty: "Moderate" },
    },
    {
      id: "3",
      type: "transport" as const,
      title: "River Boat Transfer",
      subtitle: "Scenic transport along the river",
      location: "Paramaribo to Atjoni",
      price: 120,
      priceUnit: "trip",
      images: ["/placeholder.svg"],
      rating: 4.7,
      reviewCount: 31,
      metadata: { capacity: 8, duration: "3 hours" },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Discover Adventures in
              <span className="text-primary block mt-2">Boven Suriname</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore pristine rainforests, connect with indigenous culture, and experience sustainable eco-tourism
            </p>
          </div>
          
          <SearchBar />
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">
                Featured Experiences
              </h2>
              <p className="text-muted-foreground">
                Handpicked adventures for nature lovers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Book",
                description: "Choose from stays, experiences, and transport options",
              },
              {
                step: "2",
                title: "Prepare",
                description: "Receive confirmation and travel information",
              },
              {
                step: "3",
                title: "Explore",
                description: "Enjoy your sustainable adventure in Suriname",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
