import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    location: searchParams.get("location") || undefined,
    guests: searchParams.get("guests") ? parseInt(searchParams.get("guests")!) : undefined,
    tourType: searchParams.get("tourType") || undefined,
    durationDays: searchParams.get("durationDays") ? parseInt(searchParams.get("durationDays")!) : undefined,
  }));
  const [sortBy, setSortBy] = useState("popular");
  const { data: allExperiences, isLoading } = useExperiences({ ...filters, sortBy });

  // Filter out demo content and apply tour-specific filters
  const experiences = allExperiences?.filter((exp: any) => {
    if (exp.is_demo) return false;
    if (filters.tourType && exp.tour_type !== filters.tourType) return false;
    if (filters.durationDays && exp.duration_days !== filters.durationDays) return false;
    return true;
  });

  useEffect(() => {
    const newFilters: any = {};
    if (searchParams.get("location")) newFilters.location = searchParams.get("location");
    if (searchParams.get("guests")) newFilters.guests = parseInt(searchParams.get("guests")!);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, [searchParams]);

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
        backgroundImage="/demo-content/gallery-1.jpg"
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

            <div className="mb-6 flex flex-wrap gap-2">
              <Select value={filters.tourType || "all"} onValueChange={(val) => handleFilterChange({ tourType: val === "all" ? undefined : val })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tour Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="back-to-basic">Back-to-Basic</SelectItem>
                  <SelectItem value="combination">Combination</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.durationDays?.toString() || "all"} onValueChange={(val) => handleFilterChange({ durationDays: val === "all" ? undefined : parseInt(val) })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="2">2 Days</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="4">4 Days</SelectItem>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="6">6 Days</SelectItem>
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
                {experiences?.map((experience: any) => (
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
                    badges={[
                      experience.duration_days ? `${experience.duration_days} Days` : `${experience.duration_hours}h`,
                      experience.tour_type ? experience.tour_type.replace('-', ' ').split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : experience.difficulty_level || "All levels"
                    ]}
                    metadata={{
                      duration: experience.duration_days ? `${experience.duration_days} days` : `${experience.duration_hours}h`,
                      maxParticipants: experience.max_participants,
                      durationDays: experience.duration_days,
                    }}
                    listing={experience}
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
