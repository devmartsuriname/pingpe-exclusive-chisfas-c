import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TestimonialCardProps {
  quote: string;
  rating: number;
  name: string;
  location: string;
  avatar?: string;
  delay?: number;
}

export const TestimonialCard = ({
  quote,
  rating,
  name,
  location,
  avatar,
  delay = 0,
}: TestimonialCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.02,
              rotateY: 5,
              z: 50,
            }
      }
      className="group relative bg-background/40 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Glassmorphic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Quote decoration */}
      <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif leading-none">
        "
      </div>

      <div className="relative z-10">
        {/* Animated stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? {} : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: delay + i * 0.1,
                type: "spring",
                stiffness: 200,
              }}
            >
              <Star
                className={`w-5 h-5 transition-colors duration-300 ${
                  i < rating
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            </motion.div>
          ))}
        </div>

        <p className="text-foreground mb-6 leading-relaxed relative">
          "{quote}"
        </p>

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300" />
            <Avatar className="w-12 h-12 border-2 border-primary/20 relative">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h4 className="font-semibold text-sm">{name}</h4>
            <p className="text-xs text-muted-foreground">{location}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
