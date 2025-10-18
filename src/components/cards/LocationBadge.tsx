import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface LocationBadgeProps {
  name: string;
  count: number;
  image: string;
  href: string;
}

export const LocationBadge = ({ name, count, image, href }: LocationBadgeProps) => {
  return (
    <Link
      to={href}
      className="group flex flex-col items-center text-center"
    >
      <div className="relative w-24 h-24 mb-3 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
        <OptimizedImage
          src={image}
          alt={`${name} location`}
          width={96}
          height={96}
          sizes="96px"
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-medium text-sm mb-0.5">{name}</h3>
      <p className="text-xs text-muted-foreground">{count} listings</p>
    </Link>
  );
};
