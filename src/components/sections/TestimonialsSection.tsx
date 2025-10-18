import { Star } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface Testimonial {
  name: string;
  role?: string;
  content: string;
  rating?: number;
  avatar?: string;
}

interface TestimonialsSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    testimonials?: Testimonial[];
  };
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const {
    heading = "What Our Guests Say",
    subheading = "Real experiences from real travelers",
    testimonials = [],
  } = content;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-xl text-muted-foreground">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-lg border border-border bg-card">
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
              )}
              
              <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-3">
                {testimonial.avatar && (
                  <OptimizedImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    aspectRatio="1/1"
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}