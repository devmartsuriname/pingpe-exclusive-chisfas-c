import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { HostProfileCard } from "@/components/detail/HostProfileCard";
import { BookingBar } from "@/components/detail/BookingBar";
import { useTransportDetail } from "@/hooks/useTransport";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, Briefcase, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TransportDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: transport, isLoading } = useTransportDetail(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-96 rounded-2xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!transport) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Transport not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BreadcrumbNav
          items={[
            { label: "Transport", href: "/transport" },
            { label: transport.title },
          ]}
        />

        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{transport.title}</h1>
              <Badge variant="secondary">{transport.vehicle_type}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{transport.route_from} → {transport.route_to}</span>
              </div>
            </div>
          </div>

          <ImageGallery images={transport.images || []} title={transport.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Capacity</div>
                    <div className="font-semibold">Up to {transport.capacity}</div>
                  </div>
                </div>
                {transport.duration_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold">{transport.duration_hours}h</div>
                    </div>
                  </div>
                )}
                {transport.luggage_allowance && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Luggage</div>
                      <div className="font-semibold">{transport.luggage_allowance}</div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">About this transport</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {transport.description}
                </p>
              </div>

              {transport.amenities && transport.amenities.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {transport.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <BookingBar
                price={transport.price_per_person}
                priceUnit="person"
                inventoryType="transport"
                maxCapacity={transport.capacity}
              />
              <HostProfileCard
                hostId={transport.provider_id}
                hostName="Provider"
                joinedDate={transport.created_at}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
