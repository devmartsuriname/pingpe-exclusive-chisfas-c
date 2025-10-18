import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  breadcrumbItems: BreadcrumbItem[];
}

export const PageHero = ({ title, subtitle, backgroundImage, breadcrumbItems }: PageHeroProps) => {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-sm text-white/80 mb-6">
          <Link to="/" className="hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {item.href ? (
                <Link to={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Title & Subtitle */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};
