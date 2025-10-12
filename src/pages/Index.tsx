import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSearchBar } from "@/components/search/HeroSearchBar";
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

import heroImage1 from "@/assets/hero-1.jpg";
import heroImage2 from "@/assets/hero-2.jpg";
import heroImage3 from "@/assets/hero-3.jpg";
import categoryEcolodges from "@/assets/category-ecolodges.jpg";
import categoryRivertours from "@/assets/category-rivertours.jpg";
import categoryCultural from "@/assets/category-cultural.jpg";
import categoryWildlife from "@/assets/category-wildlife.jpg";
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
    {
      id: "4",
      type: "experience" as const,
      title: "Indigenous Village Tour",
      subtitle: "Immerse in local culture and traditions",
      location: "Boven Suriname",
      price: 55,
      priceUnit: "person",
      images: ["/placeholder.svg"],
      rating: 5.0,
      reviewCount: 42,
      badges: ["Top Rated"],
      metadata: { duration: "5 hours", difficulty: "Easy" },
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
    { name: "Paramaribo", count: 127, image: "/placeholder.svg", href: "/search?location=paramaribo" },
    { name: "Boven Suriname", count: 45, image: "/placeholder.svg", href: "/search?location=boven-suriname" },
    { name: "Central Suriname", count: 38, image: "/placeholder.svg", href: "/search?location=central" },
    { name: "Commewijne", count: 22, image: "/placeholder.svg", href: "/search?location=commewijne" },
    { name: "Nickerie", count: 18, image: "/placeholder.svg", href: "/search?location=nickerie" },
    { name: "Sipaliwini", count: 31, image: "/placeholder.svg", href: "/search?location=sipaliwini" },
    { name: "Brokopondo", count: 25, image: "/placeholder.svg", href: "/search?location=brokopondo" },
    { name: "Atjoni", count: 15, image: "/placeholder.svg", href: "/search?location=atjoni" },
  ];

  const testimonials = [
    {
      quote: "Great quality products! The team is very helpful and responsive. I really enjoyed my trip to Suriname thanks to PingPe.",
      rating: 5,
      name: "Lennie Swiffan",
      location: "Netherlands",
    },
    {
      quote: "The eco-lodge was absolutely amazing. Perfect balance of comfort and nature. Will definitely come back!",
      rating: 5,
      name: "Sarah Mitchell",
      location: "United Kingdom",
    },
    {
      quote: "Unforgettable experience in the rainforest. Our guide was knowledgeable and the trip was well-organized.",
      rating: 5,
      name: "Marcus Johnson",
      location: "United States",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Split Design */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text + Search */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Discover
                <span className="text-primary block mt-2">Adventures</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore pristine rainforests, connect with indigenous culture, and experience sustainable eco-tourism
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
                <img
                  src={heroImage1}
                  alt="Suriname River"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroImage2}
                  alt="Eco-lodge"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={heroImage3}
                  alt="River adventure"
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
                Join our newsletter 🎉
              </h2>
              <p className="text-muted-foreground mb-8">
                Read and share new perspectives on just about any topic. Everyone's welcome.
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
              <img
                src={illustrationNewsletter}
                alt="Newsletter"
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
