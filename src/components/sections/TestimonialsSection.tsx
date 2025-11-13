import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  variant?: "grid" | "carousel";
  autoPlay?: boolean;
}

export function TestimonialsSection({
  content,
  variant = "grid",
  autoPlay = true,
}: TestimonialsSectionProps) {
  const {
    heading = "What Our Guests Say",
    subheading = "Real experiences from real travelers",
    testimonials = [],
  } = content;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (variant !== "carousel" || isPaused || !autoPlay || prefersReducedMotion)
      return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [
    isPaused,
    variant,
    autoPlay,
    testimonials.length,
    prefersReducedMotion,
  ]);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  if (variant === "carousel" && testimonials.length > 0) {
    const variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.8,
      }),
      center: {
        x: 0,
        opacity: 1,
        scale: 1,
      },
      exit: (direction: number) => ({
        x: direction > 0 ? -1000 : 1000,
        opacity: 0,
        scale: 0.8,
      }),
    };

    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">{heading}</h2>
              <p className="text-xl text-muted-foreground">{subheading}</p>
            </div>
          </ScrollReveal>

          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
                className="group relative bg-background/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 md:p-12 shadow-lg"
              >
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {testimonials[currentIndex].rating && (
                    <div className="flex gap-1 mb-6 justify-center">
                      {Array.from({
                        length: testimonials[currentIndex].rating || 5,
                      }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: i * 0.1,
                            type: "spring",
                          }}
                        >
                          <Star className="h-6 w-6 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <p className="text-lg md:text-xl text-foreground mb-8 italic text-center leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    {testimonials[currentIndex].avatar && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
                        <OptimizedImage
                          src={testimonials[currentIndex].avatar!}
                          alt={testimonials[currentIndex].name}
                          width={56}
                          height={56}
                          aspectRatio="1/1"
                          className="rounded-full object-cover border-2 border-primary/20 relative"
                        />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="font-semibold text-lg">
                        {testimonials[currentIndex].name}
                      </p>
                      {testimonials[currentIndex].role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonials[currentIndex].role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Grid variant (default)
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{heading}</h2>
            <p className="text-xl text-muted-foreground">{subheading}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
              <motion.div
                whileHover={
                  prefersReducedMotion
                    ? {}
                    : {
                        scale: 1.02,
                        rotateY: 5,
                        z: 50,
                      }
                }
                className="group relative bg-background/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05 + i * 0.1,
                            type: "spring",
                          }}
                        >
                          <Star className="h-5 w-5 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
                        <OptimizedImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          aspectRatio="1/1"
                          className="rounded-full object-cover border-2 border-primary/20 relative"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      {testimonial.role && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
