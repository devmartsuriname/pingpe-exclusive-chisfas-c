import { Link } from "react-router-dom";

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
      <img
        src={image}
        alt={title}
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
