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
import { usePackages } from "@/hooks/usePackages";
import { Skeleton } from "@/components/ui/skeleton";

export default function Packages() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<any>(() => {
    const guests = searchParams.get("guests");
    return guests ? { maxParticipants: parseInt(guests) } : {};
  });
  const [sortBy, setSortBy] = useState("popular");
  const { data: packages, isLoading } = usePackages({ ...filters, sortBy });

  useEffect(() => {
    const newFilters: any = {};
    const guests = searchParams.get("guests");
    if (guests) {
      newFilters.maxParticipants = parseInt(guests);
    }
    setFilters((prev: any) => ({ ...prev, ...newFilters }));
  }, [searchParams]);

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="All-Inclusive Jungle Packages in Boven Suriname | PingPe"
        description="Book complete jungle adventure packages including accommodation, experiences, meals, and transport. Explore Suriname's rainforest with hassle-free all-in-one packages."
        canonicalUrl="https://www.jungleresortpingpe.com/packages"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.jungleresortpingpe.com" },
        { name: "Packages", url: "https://www.jungleresortpingpe.com/packages" }
      ]} />
      <Header />
      <PageHero
        title="Jungle Packages"
        subtitle="Complete jungle adventures with stays, tours, meals, and transport included"
        backgroundImage="/demo-content/nature-pool.jpg"
        breadcrumbItems={[{ label: "Packages" }]}
      />
      <main className="flex-1 container mx-auto px-4 pt-12 pb-16">

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar onFilterChange={handleFilterChange} filterType="packages" />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {isLoading ? "Loading..." : `${packages?.length || 0} packages found`}
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
                {packages?.map((pkg) => (
                  <ListingCard
                    key={pkg.id}
                    id={pkg.id}
                    type="package"
                    title={pkg.title}
                    images={pkg.images || []}
                    location="Multi-destination"
                    rating={4.9}
                    reviewCount={35}
                    price={pkg.price_total}
                    priceUnit="package"
                    badges={[`${pkg.duration_days} days`]}
                    metadata={{
                      durationDays: pkg.duration_days,
                      maxParticipants: pkg.max_participants,
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
