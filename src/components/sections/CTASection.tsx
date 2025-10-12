import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  content: {
    heading?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
  };
}

export function CTASection({ content }: CTASectionProps) {
  const {
    heading = "Ready to Start Your Adventure?",
    description = "Book your stay with us today and experience the magic of Suriname",
    buttonText = "Book Now",
    buttonLink = "/stays",
    backgroundImage,
  } = content;

  return (
    <section
      className="relative py-24 bg-primary text-primary-foreground overflow-hidden"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {backgroundImage && <div className="absolute inset-0 bg-black/60" />}
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">{heading}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">{description}</p>
        <Button size="lg" variant="secondary" asChild className="hover-scale">
          <a href={buttonLink}>
            {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
    </section>
  );
}