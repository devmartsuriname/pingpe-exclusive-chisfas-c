import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { HostProfileCard } from "@/components/detail/HostProfileCard";
import { BookingBar } from "@/components/detail/BookingBar";
import { useExperienceDetail } from "@/hooks/useExperiences";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ExperienceDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: experience, isLoading } = useExperienceDetail(id!);

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

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Experience not found</p>
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
            { label: "Experiences", href: "/experiences" },
            { label: experience.title },
          ]}
        />

        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{experience.title}</h1>
              {experience.difficulty_level && (
                <Badge variant="secondary">{experience.difficulty_level}</Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{experience.meeting_point}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-medium">4.9</span>
                <span>(28 reviews)</span>
              </div>
            </div>
          </div>

          <ImageGallery images={experience.images || []} title={experience.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold">{experience.duration_hours}h</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Group Size</div>
                    <div className="font-semibold">Up to {experience.max_participants}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">About this experience</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {experience.includes && experience.includes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                    <ul className="space-y-2">
                      {experience.includes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {experience.what_to_bring && experience.what_to_bring.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What to Bring</h2>
                    <ul className="space-y-2">
                      {experience.what_to_bring.map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-muted-foreground">•</span>
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
                price={experience.price_per_person}
                priceUnit="person"
                inventoryType="experience"
                maxCapacity={experience.max_participants}
              />
              <HostProfileCard
                hostId={experience.host_id}
                hostName="Host"
                joinedDate={experience.created_at}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
