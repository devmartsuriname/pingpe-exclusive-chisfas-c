import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { HostProfileCard } from "@/components/detail/HostProfileCard";
import { BookingBar } from "@/components/detail/BookingBar";
import { usePropertyDetail } from "@/hooks/useProperties";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, BedDouble, Home, Bath, MapPin, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function StayDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading } = usePropertyDetail(id!);

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

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Property not found</p>
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
            { label: "Stays", href: "/stays" },
            { label: property.title },
          ]}
        />

        <div className="space-y-8">
          {/* Title & Location */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <Badge variant="secondary">{property.property_type}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{property.city}, {property.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-medium">4.8</span>
                <span>(42 reviews)</span>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <ImageGallery images={property.images || []} title={property.title} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Guests</div>
                    <div className="font-semibold">{property.guests}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Beds</div>
                    <div className="font-semibold">{property.beds}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4">About this place</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              <Separator />

              {/* Amenities */}
              {property.property_amenities && property.property_amenities.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {property.property_amenities.map((item: any) => (
                      <div key={item.amenities.id} className="flex items-center gap-2">
                        <span className="text-2xl">{item.amenities.icon || "✓"}</span>
                        <span>{item.amenities.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {property.reviews && property.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {property.reviews.slice(0, 3).map((review: any) => (
                      <div key={review.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="font-medium">{review.profiles?.full_name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No reviews yet</p>
                )}
              </div>
            </div>

            {/* Right Column - Booking & Host */}
            <div className="space-y-6">
              <BookingBar
                price={property.price_per_night}
                priceUnit="night"
                inventoryType="stay"
                maxCapacity={property.guests}
              />
              {property.profiles && (
                <HostProfileCard
                  hostId={property.profiles.id}
                  hostName={property.profiles.full_name || "Host"}
                  hostAvatar={property.profiles.avatar_url}
                  hostBio={property.profiles.bio}
                  joinedDate={property.profiles.created_at}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
