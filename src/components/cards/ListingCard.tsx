import { Link } from "react-router-dom";
import { Heart, Star, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";

export type InventoryType = "stay" | "experience" | "transport" | "package" | "event";

interface ListingCardProps {
  id: string;
  type: InventoryType;
  title: string;
  subtitle?: string;
  location: string;
  price: number;
  priceUnit?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  badges?: string[];
  metadata?: {
    guests?: number;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    duration?: string | number;
    difficulty?: string;
    capacity?: number;
    maxParticipants?: number;
    durationDays?: number;
    maxAttendees?: number;
    date?: string;
  };
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  className?: string;
}

export function ListingCard({
  id,
  type,
  title,
  subtitle,
  location,
  price,
  priceUnit = "night",
  images,
  rating,
  reviewCount,
  badges = [],
  metadata,
  isFavorite = false,
  onFavoriteToggle,
  className,
}: ListingCardProps) {
  const baseHref = `/${type}s/${id}`;
  const primaryImage = images[0] || "/placeholder.svg";

  const renderMetadata = () => {
    switch (type) {
      case "stay":
        return (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {metadata?.guests && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {metadata.guests} guests
              </span>
            )}
            {metadata?.bedrooms && (
              <span>{metadata.bedrooms} bedrooms</span>
            )}
          </div>
        );
      case "experience":
        return (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {metadata?.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {metadata.duration}
              </span>
            )}
            {metadata?.difficulty && (
              <Badge variant="outline" className="text-xs">
                {metadata.difficulty}
              </Badge>
            )}
          </div>
        );
      case "transport":
        return (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {metadata?.capacity && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Up to {metadata.capacity}
              </span>
            )}
            {metadata?.duration && <span>{metadata.duration}</span>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <Link to={baseHref} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          <OptimizedImage
            src={primaryImage}
            alt={title}
            width={600}
            height={450}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Badges Overlay */}
          {badges.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  className="bg-background/90 backdrop-blur-sm text-foreground shadow-sm"
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background rounded-full"
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle?.();
            }}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all",
                isFavorite ? "fill-red-500 text-red-500" : "text-foreground/70"
              )}
            />
          </Button>
        </div>

        {/* Content */}
        <div className="pt-4 space-y-2">
          {/* Location & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{location}</span>
            </div>
            {rating && (
              <div className="flex items-center gap-1 text-sm font-medium">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span>{rating.toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-muted-foreground">({reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {subtitle}
            </p>
          )}

          {/* Metadata */}
          {renderMetadata()}

          {/* Price */}
          <div className="flex items-baseline gap-1 pt-2">
            <span className="text-xl font-bold text-foreground">
              €{price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/ {priceUnit}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
