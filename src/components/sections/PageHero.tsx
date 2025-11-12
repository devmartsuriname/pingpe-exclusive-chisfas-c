import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effects (disabled if user prefers reduced motion)
  const backgroundY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], prefersReducedMotion ? [1, 1] : [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], prefersReducedMotion ? ["0%", "0%"] : ["0%", "20%"]);

  return (
    <section ref={ref} className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        <OptimizedImage
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover"
          priority
        />
      </motion.div>

      {/* Multi-layer Animated Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 mix-blend-overlay" />

      {/* Content with Entrance Animations */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 text-center text-white"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Glassmorphism Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center justify-center gap-2 text-sm text-white/90 mb-6 px-6 py-3 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg"
        >
          <Link to="/" className="hover:text-white transition-colors hover:scale-110 inline-block">
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {item.href ? (
                <Link to={item.href} className="hover:text-white transition-all hover:scale-105">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white font-semibold">{item.label}</span>
              )}
            </div>
          ))}
        </motion.nav>

        {/* Staggered Title Animation */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="font-display text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"
        >
          {title}
        </motion.h1>

        {/* Staggered Subtitle Animation */}
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
};
