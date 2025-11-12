import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  title: string;
  count: number;
  image: string;
  href: string;
}

export const CategoryCard = ({ title, count, image, href }: CategoryCardProps) => {
  const { ref, isInView } = useScrollReveal({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link to={href} className="block">
        <motion.div
          whileHover={{ 
            scale: 1.05,
            rotateX: 5,
            rotateY: 5,
            transition: { duration: 0.3 }
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="group relative overflow-hidden rounded-2xl aspect-square"
        >
          <OptimizedImage
            src={image}
            alt={`${title} category`}
            width={400}
            height={400}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Multi-layer gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

          {/* Glassmorphic bottom container */}
          <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-black/30 border-t border-white/10">
            <motion.h3 
              className="font-display text-xl font-semibold mb-1 text-white"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h3>
            <p className="text-sm text-white/90">{count} experiences</p>
            
            {/* Animated arrow indicator */}
            <motion.div
              className="absolute right-6 top-1/2 -translate-y-1/2"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
