import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { HostProfileCard } from "@/components/detail/HostProfileCard";
import { BookingBar } from "@/components/detail/BookingBar";
import { usePackageDetail } from "@/hooks/usePackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: pkg, isLoading } = usePackageDetail(id!);

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

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p>Package not found</p>
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
            { label: "Packages", href: "/packages" },
            { label: pkg.title },
          ]}
        />

        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{pkg.title}</h1>
              <Badge variant="secondary">{pkg.duration_days} days</Badge>
            </div>
          </div>

          <ImageGallery images={pkg.images || []} title={pkg.title} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold">{pkg.duration_days} days</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Group Size</div>
                    <div className="font-semibold">Up to {pkg.max_participants}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-2xl font-bold mb-4">About this package</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {pkg.includes_summary && pkg.includes_summary.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Package Includes</h2>
                    <ul className="space-y-2">
                      {pkg.includes_summary.map((item: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {pkg.discount_percentage && (
                <>
                  <Separator />
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <p className="text-success font-semibold">
                      Save {pkg.discount_percentage}% by booking this package!
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <BookingBar
                price={pkg.price_total}
                priceUnit="package"
                inventoryType="package"
                maxCapacity={pkg.max_participants}
              />
              <HostProfileCard
                hostId={pkg.creator_id}
                hostName={pkg.profiles?.full_name || "Creator"}
                hostAvatar={pkg.profiles?.avatar_url}
                hostBio={pkg.profiles?.bio}
                joinedDate={pkg.profiles?.created_at || pkg.created_at}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
