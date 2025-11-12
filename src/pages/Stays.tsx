import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { ListingCard } from "@/components/cards/ListingCard";
import { PageHero } from "@/components/sections/PageHero";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import SEO from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Filter } from "lucide-react";

export default function Stays() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    location: searchParams.get("location") || undefined,
    guests: searchParams.get("guests") ? parseInt(searchParams.get("guests")!) : undefined,
  }));
  const [sortBy, setSortBy] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const { data: properties, isLoading } = useProperties({ ...filters, sortBy });
  const isMobile = useMediaQuery("(max-width: 1024px)");

  // Count active filters
  const activeFilterCount = (filters.location ? 1 : 0) + (filters.guests ? 1 : 0);

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
        title="Jungle Stays & Accommodations in Boven Suriname | PingPe"
        description="Find unique jungle lodges, eco-resorts, and traditional accommodations in Suriname's pristine rainforest. Book authentic stays with indigenous communities."
        canonicalUrl="https://www.jungleresortpingpe.com/stays"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://www.jungleresortpingpe.com" },
        { name: "Stays", url: "https://www.jungleresortpingpe.com/stays" }
      ]} />
      <Header />
      <PageHero
        title="Jungle Stays"
        subtitle="Discover authentic lodges and eco-resorts in Suriname's pristine rainforest"
        backgroundImage="/demo-content/gallery-1.jpg"
        breadcrumbItems={[{ label: "Stays" }]}
      />
      <main className="flex-1 container mx-auto px-4 pt-12 pb-16">

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar 
              onFilterChange={handleFilterChange} 
              filterType="stays"
              isOpen={isMobile ? filterOpen : true}
              onClose={() => setFilterOpen(false)}
            />
          </aside>

          {/* Mobile Filter Button */}
          {isMobile && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="fixed bottom-6 right-6 z-30"
            >
              <Button
                size="lg"
                onClick={() => setFilterOpen(true)}
                className="rounded-full h-14 w-14 shadow-2xl hover:shadow-primary/50 
                           transition-shadow relative"
              >
                <Filter className="h-6 w-6" />
                
                {/* Active filters badge */}
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full 
                               bg-destructive text-white text-xs flex items-center 
                               justify-center font-bold"
                  >
                    {activeFilterCount}
                  </motion.div>
                )}
              </Button>
            </motion.div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {isLoading ? "Loading..." : `${properties?.length || 0} stays found`}
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
                {properties?.map((property) => (
                  <ListingCard
                    key={property.id}
                    id={property.id}
                    type="stay"
                    title={property.title}
                    images={property.images || []}
                    location={`${property.city}, ${property.country}`}
                    rating={4.8}
                    reviewCount={42}
                    price={property.price_per_night}
                    priceUnit="night"
                    badges={[property.property_type]}
                    metadata={{
                      guests: property.guests,
                      bedrooms: property.bedrooms,
                      beds: property.beds,
                      bathrooms: property.bathrooms,
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
