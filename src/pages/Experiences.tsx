import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { ListingCard } from "@/components/cards/ListingCard";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import SEO from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useExperiences } from "@/hooks/useExperiences";
import { Skeleton } from "@/components/ui/skeleton";

export default function Experiences() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("popular");
  const { data: experiences, isLoading } = useExperiences({ ...filters, sortBy });

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Jungle Adventures & Experiences in Boven Suriname | PingPe"
        description="Discover authentic rainforest adventures, wildlife tours, cultural experiences, and guided expeditions in Suriname's pristine jungle with indigenous guides."
        canonicalUrl="https://www.jungleresortpingpe.com/experiences"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.jungleresortpingpe.com" },
        { name: "Experiences", url: "https://www.jungleresortpingpe.com/experiences" }
      ]} />
      <Header />
      <PageHero
        title="Jungle Experiences"
        subtitle="Embark on unforgettable jungle adventures with local expert guides"
        backgroundImage="/demo-content/back-to-basic-tour.jpg"
        breadcrumbItems={[{ label: "Experiences" }]}
      />
      <main className="flex-1 container mx-auto px-4 pt-12 pb-16">

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar onFilterChange={handleFilterChange} filterType="experiences" />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {isLoading ? "Loading..." : `${experiences?.length || 0} experiences found`}
              </h1>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {experiences?.map((experience) => (
                  <ListingCard
                    key={experience.id}
                    id={experience.id}
                    type="experience"
                    title={experience.title}
                    images={experience.images || []}
                    location={experience.meeting_point}
                    rating={4.9}
                    reviewCount={28}
                    price={experience.price_per_person}
                    priceUnit="person"
                    badges={[experience.difficulty_level || "All levels"]}
                    metadata={{
                      duration: `${experience.duration_hours}h`,
                      maxParticipants: experience.max_participants,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
