import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { ListingCard } from "@/components/cards/ListingCard";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import SEO from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProperties } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";

export default function Stays() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("popular");
  const { data: properties, isLoading } = useProperties({ ...filters, sortBy });

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
      <main className="flex-1 container mx-auto px-4 py-8">
        <BreadcrumbNav items={[{ label: "Stays" }]} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar onFilterChange={handleFilterChange} filterType="stays" />
          </aside>

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
