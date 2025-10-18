import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface CategoryCardProps {
  title: string;
  count: number;
  image: string;
  href: string;
}

export const CategoryCard = ({ title, count, image, href }: CategoryCardProps) => {
  return (
    <Link
      to={href}
      className="group relative overflow-hidden rounded-2xl aspect-square block"
    >
      <OptimizedImage
        src={image}
        alt={`${title} category`}
        width={400}
        height={400}
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="font-display text-xl font-semibold mb-1">{title}</h3>
        <p className="text-sm text-white/90">{count} experiences</p>
      </div>
    </Link>
  );
};
