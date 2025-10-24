import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ProductSchema } from "@/components/seo/ProductSchema";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { HostProfileCard } from "@/components/detail/HostProfileCard";
import { BookingBar } from "@/components/detail/BookingBar";
import { useExperienceDetail } from "@/hooks/useExperiences";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, Star, Calendar, Bus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DayByDayAccordion } from "@/components/experiences/DayByDayAccordion";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://www.jungleresortpingpe.com/experiences/${id}`;
  const breadcrumbs = [
    { name: "Home", url: "https://www.jungleresortpingpe.com/" },
    { name: "Experiences", url: "https://www.jungleresortpingpe.com/experiences" },
    { name: experience.title, url: currentUrl }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${experience.title} - Jungle Resort PingPe`}
        description={experience.description || `Experience ${experience.title} at ${experience.meeting_point}`}
        image={experience.images?.[0]}
        url={currentUrl}
        schemaType="Product"
        canonicalUrl={currentUrl}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name={experience.title}
        description={experience.description || `Authentic jungle experience in Suriname`}
        image={experience.images || []}
        url={currentUrl}
        price={Number(experience.price_per_person)}
        priceCurrency="USD"
        availability="InStock"
        rating={{
          ratingValue: 4.9,
          reviewCount: 28
        }}
        brand="Jungle Resort PingPe"
        category="Experience"
      />
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
                {experience.duration_days ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold">{experience.duration_days} Days</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                      <div className="font-semibold">{experience.duration_hours}h</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Group Size</div>
                    <div className="font-semibold">Up to {experience.max_participants}</div>
                  </div>
                </div>
                {experience.tour_type && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {experience.tour_type.replace('-', ' ')}
                    </Badge>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">About this experience</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {experience.day_program && experience.day_program.length > 0 && (
                <>
                  <Separator />
                  <DayByDayAccordion dayProgram={experience.day_program as any[]} />
                </>
              )}

              {experience.transport_options && Array.isArray(experience.transport_options) && experience.transport_options.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Bus className="h-6 w-6" />
                      Transport Options
                    </h2>
                    <div className="space-y-3">
                      {(experience.transport_options as any[]).map((option, index) => (
                        <div key={index} className="p-4 bg-muted/50 rounded-lg">
                          <h3 className="font-semibold mb-1">{option.name}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          {option.surcharge_note && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              {option.surcharge_note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {experience.includes && Array.isArray(experience.includes) && experience.includes.length > 0 && (
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
                    {!experience.is_demo && (
                      <Alert className="mt-4">
                        <AlertDescription className="text-sm">
                          *Prices are based on current economic conditions and may be adjusted if unexpected changes occur. Excludes alcoholic beverages.
                        </AlertDescription>
                      </Alert>
                    )}
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
              hostName={experience.profiles?.full_name || "Host"}
              hostAvatar={experience.profiles?.avatar_url}
              hostBio={experience.profiles?.bio}
              joinedDate={experience.profiles?.created_at || experience.created_at}
            />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
