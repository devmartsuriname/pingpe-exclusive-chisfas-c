import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { ListingCard } from "@/components/cards/ListingCard";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransport } from "@/hooks/useTransport";
import { Skeleton } from "@/components/ui/skeleton";

export default function Transport() {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("popular");
  const { data: transport, isLoading } = useTransport({ ...filters, sortBy });

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BreadcrumbNav items={[{ label: "Transport" }]} />

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FilterSidebar onFilterChange={handleFilterChange} filterType="transport" />
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">
                {isLoading ? "Loading..." : `${transport?.length || 0} transport options found`}
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
                {transport?.map((item) => (
                  <ListingCard
                    key={item.id}
                    id={item.id}
                    type="transport"
                    title={item.title}
                    images={item.images || []}
                    location={`${item.route_from} → ${item.route_to}`}
                    rating={4.7}
                    reviewCount={15}
                    price={item.price_per_person}
                    priceUnit="person"
                    badges={[item.vehicle_type]}
                    metadata={{
                      capacity: item.capacity,
                      duration: item.duration_hours ? `${item.duration_hours}h` : undefined,
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
