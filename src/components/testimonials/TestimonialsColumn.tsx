import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}

export const TestimonialsColumn = ({
  testimonials,
  duration = 12,
  className,
}: TestimonialsColumnProps) => {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className={className}>
      <motion.div
        animate={prefersReducedMotion ? {} : { translateY: "-50%" }}
        transition={
          prefersReducedMotion
            ? {}
            : {
                duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }
        }
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="p-10 bg-background rounded-3xl border border-border shadow-lg shadow-primary/10 max-w-xs w-full"
              >
                <p className="text-muted-foreground leading-relaxed mb-5">
                  "{text}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={image}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium tracking-tight leading-5">
                      {name}
                    </div>
                    <div className="text-sm opacity-60 tracking-tight leading-5">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
