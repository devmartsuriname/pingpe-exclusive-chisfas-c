import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { HostProfileCard } from "@/components/detail/HostProfileCard";
import { BookingBar } from "@/components/detail/BookingBar";
import { useEventDetail } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEventDetail(id!);

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

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Event not found</p>
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
            { label: "Events", href: "/events" },
            { label: event.title },
          ]}
        />

        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              {event.category && <Badge variant="secondary">{event.category}</Badge>}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(event.event_date), "PPP")}</span>
              </div>
            </div>
          </div>

          <ImageGallery images={event.images || []} title={event.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-semibold">
                      {format(new Date(event.event_date), "MMM dd, yyyy")}
                    </div>
                  </div>
                </div>
                {event.duration_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold">{event.duration_hours}h</div>
                    </div>
                  </div>
                )}
                {event.max_attendees && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Capacity</div>
                      <div className="font-semibold">Up to {event.max_attendees}</div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">About this event</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              {event.includes && event.includes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                    <ul className="space-y-2">
                      {event.includes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <BookingBar
                price={event.price_per_person}
                priceUnit="person"
                inventoryType="event"
                maxCapacity={event.max_attendees || 50}
              />
            <HostProfileCard
              hostId={event.organizer_id}
              hostName={(event as any).profiles?.full_name || "Organizer"}
              hostAvatar={(event as any).profiles?.avatar_url}
              hostBio={(event as any).profiles?.bio}
              joinedDate={(event as any).profiles?.created_at || event.created_at}
            />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
