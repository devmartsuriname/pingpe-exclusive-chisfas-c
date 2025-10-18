import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
  content: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

export function HeroSection({ content }: HeroSectionProps) {
  const {
    title = "Welcome to PingPe",
    subtitle = "Experience the untouched beauty of Suriname's rainforest",
    backgroundImage,
    ctaText = "Explore",
    ctaLink = "#",
  } = content;

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {backgroundImage ? (
        <>
          <OptimizedImage
            src={backgroundImage}
            alt={title}
            priority={true}
            width={1920}
            height={600}
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : (
        <div 
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%)"
          }}
        />
      )}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">{title}</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in">{subtitle}</p>
        <Button size="lg" asChild className="animate-scale-in">
          <a href={ctaLink}>
            {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
    </section>
  );
}