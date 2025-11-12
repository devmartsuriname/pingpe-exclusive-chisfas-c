import { Link } from "react-router-dom";
import { Heart, Star, Users, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  listing?: any; // Full listing object for additional data
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
  listing,
}: ListingCardProps) {
  const baseHref = `/${type}s/${id}`;
  const primaryImage = images[0] || "/placeholder.svg";
  const [isHovered, setIsHovered] = useState(false);
  const { ref, isInView } = useScrollReveal({ threshold: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  // 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

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
          <div className="space-y-2">
            {/* Multi-day tour badges */}
            {(metadata?.durationDays || listing?.duration_days) && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {metadata?.durationDays || listing?.duration_days} Day{(metadata?.durationDays || listing?.duration_days) > 1 ? 's' : ''}
                </Badge>
                {(listing?.tour_type) && (
                  <Badge variant="secondary" className="text-xs capitalize">
                    {listing.tour_type === 'back-to-basic' ? 'Back-to-Basic' : listing.tour_type}
                  </Badge>
                )}
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {metadata?.duration && !metadata?.durationDays && !listing?.duration_days && (
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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      <Link
        to={baseHref}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          style={{
            rotateX: !prefersReducedMotion && isHovered ? rotateX : 0,
            rotateY: !prefersReducedMotion && isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          className="group relative rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl"
        >
          {/* Image with enhanced hover */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted group-hover:shadow-2xl transition-shadow duration-500">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <OptimizedImage
                src={primaryImage}
                alt={title}
                width={600}
                height={450}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Glassmorphism Badges */}
            {badges.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    className="backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 text-white font-medium shadow-lg shadow-primary/10"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Enhanced Favorite Button */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3"
            >
              <Button
                variant="ghost"
                size="icon"
                className="backdrop-blur-xl bg-white/20 dark:bg-white/10 border border-white/30 hover:bg-white/30 rounded-full shadow-xl"
                onClick={(e) => {
                  e.preventDefault();
                  onFavoriteToggle?.();
                }}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <motion.div
                  animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-all",
                      isFavorite && "fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    )}
                    style={{ color: isFavorite ? undefined : "white" }}
                  />
                </motion.div>
              </Button>
            </motion.div>
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

            {/* Animated Price with Glow */}
            <motion.div 
              className="flex items-baseline gap-1 pt-2 relative"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl font-bold text-foreground relative">
                <span className="relative z-10">€{price.toLocaleString()}</span>
                <motion.span
                  className="absolute inset-0 blur-lg bg-primary/30 -z-10"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
              <span className="text-sm text-muted-foreground">/ {priceUnit}</span>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
