import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { HeroSearchBar } from "@/components/search/HeroSearchBar";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ListingCard } from "@/components/cards/ListingCard";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { HostCard } from "@/components/cards/HostCard";
import { LocationBadge } from "@/components/cards/LocationBadge";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { IllustratedStep } from "@/components/how-it-works/IllustratedStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import heroImage1 from "@/assets/pingpe-waterfall.jpg";
import heroImage2 from "@/assets/pingpe-river.jpg";
import heroImage3 from "@/assets/pingpe-ananasberg.jpg";
import categoryEcolodges from "@/assets/category-ecolodges.jpg";
import categoryRivertours from "@/assets/category-rivertours.jpg";
import categoryCultural from "@/assets/category-cultural.jpg";
import categoryWildlife from "@/assets/category-wildlife.jpg";
import boatTour from "@/assets/pingpe-boat.jpg";
import cultureExperience from "@/assets/pingpe-culture.jpg";
import locationParamaribo from "@/assets/location-paramaribo.jpg";
import locationBovenSuriname from "@/assets/pingpe-river.jpg";
import locationCentral from "@/assets/location-central.jpg";
import locationCommewijne from "@/assets/location-commewijne.jpg";
import locationNickerie from "@/assets/location-nickerie.jpg";
import locationSipaliwini from "@/assets/location-sipaliwini.jpg";
import locationBrokopondo from "@/assets/location-brokopondo.jpg";
import locationAtjoni from "@/assets/location-atjoni.jpg";
import illustrationBook from "@/assets/illustration-book.svg";
import illustrationRequest from "@/assets/illustration-request.svg";
import illustrationFun from "@/assets/illustration-fun.svg";
import illustrationNewsletter from "@/assets/illustration-newsletter.svg";

const Index = () => {
  const [activeType, setActiveType] = useState("stays");

  const inventoryTypes = [
    { id: "stays", label: "Stays", count: 23 },
    { id: "experiences", label: "Experiences", count: 45 },
    { id: "transport", label: "Transport", count: 12 },
    { id: "packages", label: "Packages", count: 8 },
    { id: "events", label: "Events", count: 15 },
  ];

  const categories = [
    { title: "Eco-Lodges", count: 23, image: categoryEcolodges, href: "/stays?category=eco-lodges" },
    { title: "River Tours", count: 18, image: categoryRivertours, href: "/experiences?category=river-tours" },
    { title: "Cultural Experiences", count: 31, image: categoryCultural, href: "/experiences?category=cultural" },
    { title: "Wildlife Watching", count: 12, image: categoryWildlife, href: "/experiences?category=wildlife" },
  ];

  // Real PingPe tours and experiences
  const demoListings = [
    {
      id: "1",
      type: "experience" as const,
      title: "Back to Basic Tour",
      subtitle: "Authentic jungle experience on the Boven-Suriname River",
      location: "Boven-Suriname River",
      price: 285,
      priceUnit: "person",
      images: [heroImage3],
      rating: 4.9,
      reviewCount: 47,
      badges: ["Popular", "Featured"],
      metadata: { duration: "3 days", difficulty: "Easy" },
    },
    {
      id: "2",
      type: "experience" as const,
      title: "Extended Jungle Adventure",
      subtitle: "Deep dive into Suriname's interior wilderness",
      location: "Central Suriname Nature Reserve",
      price: 520,
      priceUnit: "person",
      images: [heroImage1],
      rating: 5.0,
      reviewCount: 32,
      badges: ["Top Rated", "Adventure"],
      metadata: { duration: "6 days", difficulty: "Moderate" },
    },
    {
      id: "3",
      type: "experience" as const,
      title: "River Hopping Tour",
      subtitle: "Multi-lodge experience along the Boven-Suriname",
      location: "Boven-Suriname River",
      price: 380,
      priceUnit: "person",
      images: [boatTour],
      rating: 4.8,
      reviewCount: 28,
      badges: ["Customizable"],
      metadata: { duration: "4-5 days", difficulty: "Easy to Moderate" },
    },
    {
      id: "4",
      type: "experience" as const,
      title: "Day Experience at PingPe",
      subtitle: "Quick authentic jungle experience",
      location: "PingPe Resort",
      price: 95,
      priceUnit: "person",
      images: [cultureExperience],
      rating: 4.7,
      reviewCount: 61,
      badges: ["Day Trip"],
      metadata: { duration: "1 day", difficulty: "Easy" },
    },
  ];

  const hosts = [
    { id: "1", name: "John Doe", rating: 4.9, location: "Paramaribo, Suriname" },
    { id: "2", name: "Maria Silva", rating: 5.0, location: "Boven Suriname" },
    { id: "3", name: "David Chen", rating: 4.8, location: "Central Suriname" },
    { id: "4", name: "Sarah Johnson", rating: 4.9, location: "Atjoni" },
    { id: "5", name: "Carlos Rodriguez", rating: 4.7, location: "Paramaribo, Suriname" },
    { id: "6", name: "Anna Williams", rating: 5.0, location: "Boven Suriname" },
    { id: "7", name: "Michael Brown", rating: 4.8, location: "Commewijne" },
    { id: "8", name: "Lisa Anderson", rating: 4.9, location: "Nickerie" },
    { id: "9", name: "Robert Taylor", rating: 4.7, location: "Sipaliwini" },
    { id: "10", name: "Emma Davis", rating: 5.0, location: "Brokopondo" },
  ];

  const locations = [
    { name: "Paramaribo", count: 127, image: locationParamaribo, href: "/search?location=paramaribo" },
    { name: "Boven Suriname", count: 45, image: locationBovenSuriname, href: "/search?location=boven-suriname" },
    { name: "Central Suriname", count: 38, image: locationCentral, href: "/search?location=central" },
    { name: "Commewijne", count: 22, image: locationCommewijne, href: "/search?location=commewijne" },
    { name: "Nickerie", count: 18, image: locationNickerie, href: "/search?location=nickerie" },
    { name: "Sipaliwini", count: 31, image: locationSipaliwini, href: "/search?location=sipaliwini" },
    { name: "Brokopondo", count: 25, image: locationBrokopondo, href: "/search?location=brokopondo" },
    { name: "Atjoni", count: 15, image: locationAtjoni, href: "/search?location=atjoni" },
  ];

  const testimonials = [
    {
      quote: "The Back to Basic tour exceeded all expectations. Our guide was incredibly knowledgeable about the jungle and Saramaccan culture. The authentic village visits and river life were unforgettable!",
      rating: 5,
      name: "Lennie Swiffan",
      location: "Netherlands",
    },
    {
      quote: "PingPe Resort is a hidden gem! The traditional huts right on the river, amazing food, and the warmth of the local people made this the highlight of our Suriname trip. Highly recommend the Extended Adventure!",
      rating: 5,
      name: "Marco Barneveld",
      location: "National Geographic Traveller",
    },
    {
      quote: "As featured in National Geographic - this is authentic eco-tourism done right. The guides are from the local community, the resort is sustainably built, and the experience is genuinely immersive.",
      rating: 5,
      name: "Sarah Mitchell",
      location: "United Kingdom",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Jungle Resort PingPe - Authentic Upper Suriname Rainforest Adventures"
        description="Experience authentic rainforest adventures at Jungle Resort PingPe. Eco-friendly lodges, guided jungle tours, and immersive Saramaccan cultural experiences in Upper Suriname."
        url="https://www.jungleresortpingpe.com"
      />
      <WebSiteSchema
        name="Jungle Resort PingPe"
        url="https://www.jungleresortpingpe.com"
        description="Authentic Upper Suriname Rainforest Adventures and Eco-Tourism Experiences"
        searchUrl="https://www.jungleresortpingpe.com/search?q={search_term_string}"
      />
      <OrganizationSchema
        name="Jungle Resort PingPe"
        description="Leading eco-tourism provider in Upper Suriname, offering authentic jungle experiences and cultural immersion in the Boven-Suriname River region."
        url="https://www.jungleresortpingpe.com"
        logo="https://www.jungleresortpingpe.com/logo.png"
        foundingDate="2010"
        email="info@jungleresortpingpe.com"
        phone="+597-XXXXXXX"
        address={{
          streetAddress: "Boven-Suriname River Region",
          addressLocality: "Upper Suriname",
          addressCountry: "SR"
        }}
        sameAs={[
          "https://www.facebook.com/pingperesort",
          "https://www.instagram.com/pingperesort"
        ]}
      />
      <Header />

      {/* Hero Section - Split Design */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text + Search */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Experience Authentic
                <span className="text-primary block mt-2">Upper Suriname</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join Jungle Resort PingPe for fully guided tours to Suriname's interior. Immerse yourself in pristine rainforests and authentic Saramaccan culture on the Boven-Suriname River.
              </p>

              <HeroSearchBar />

              {/* Type Selector Pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {inventoryTypes.map((type) => (
                  <Badge
                    key={type.id}
                    variant={activeType === type.id ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2"
                    onClick={() => setActiveType(type.id)}
                  >
                    {type.label} • {type.count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Right: Photo Collage */}
            <div className="hidden lg:grid grid-cols-2 gap-4 h-[500px]">
              <div className="relative overflow-hidden rounded-2xl row-span-2">
                <OptimizedImage
                  src={heroImage1}
                  alt="PingPe waterfall cascading through lush Suriname rainforest"
                  priority={true}
                  width={800}
                  height={1000}
                  sizes="(max-width: 1024px) 0vw, 40vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <OptimizedImage
                  src={heroImage2}
                  alt="Traditional eco-lodge on the Boven-Suriname River"
                  width={800}
                  height={480}
                  sizes="(max-width: 1024px) 0vw, 40vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <OptimizedImage
                  src={heroImage3}
                  alt="Jungle adventure tour exploring Ananasberg mountain"
                  width={800}
                  height={480}
                  sizes="(max-width: 1024px) 0vw, 40vw"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adventure Carousel Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold mb-8">
            Let's go on an adventure
          </h2>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {categories.map((category) => (
                <CarouselItem key={category.title} className="pl-4 md:basis-1/2 lg:basis-1/4">
                  <CategoryCard {...category} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-6">
              <CarouselPrevious className="relative static translate-y-0" />
              <CarouselNext className="relative static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Experience Listings - 4 Column Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold mb-2">
                Experience listings
              </h2>
              <p className="text-muted-foreground">
                Popular experiences for nature lovers
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              Show all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demoListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <IllustratedStep
              image={illustrationBook}
              title="Book a trip"
              description="Choose from stays, experiences, and transport options"
            />
            <IllustratedStep
              image={illustrationRequest}
              title="Send a request"
              description="Receive confirmation and travel information"
            />
            <IllustratedStep
              image={illustrationFun}
              title="Have fun!"
              description="Enjoy your sustainable adventure in Suriname"
            />
          </div>
        </div>
      </section>

      {/* Become a Host */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-2">
              Become a host
            </h2>
            <p className="text-muted-foreground">
              Join our community of hosts and share your space
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {hosts.map((host) => (
              <HostCard key={host.id} {...host} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              See all hosts
            </Button>
          </div>
        </div>
      </section>

      {/* Explore Nearby */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold mb-8">
            Explore nearby
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {locations.map((location) => (
              <LocationBadge key={location.name} {...location} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter with Illustration */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text + Form */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Get PingPe Updates 🌿
              </h2>
              <p className="text-muted-foreground mb-8">
                Subscribe to receive special offers, new tour announcements, and insider tips for exploring Suriname's interior.
              </p>

              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button type="submit" className="px-8">
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Right: Illustration */}
            <div className="hidden lg:flex justify-center">
              <OptimizedImage
                src={illustrationNewsletter}
                alt="Newsletter subscription illustration"
                width={512}
                height={512}
                sizes="(max-width: 1024px) 0vw, 512px"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Good news from far away 🏝️
          </h2>

          <div className="max-w-5xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <TestimonialCard {...testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-8">
                <CarouselPrevious className="relative static translate-y-0" />
                <CarouselNext className="relative static translate-y-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
