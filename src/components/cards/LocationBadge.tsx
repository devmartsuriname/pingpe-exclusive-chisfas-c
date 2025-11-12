import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface LocationBadgeProps {
  name: string;
  count: number;
  image: string;
  href: string;
}

export const LocationBadge = ({ name, count, image, href }: LocationBadgeProps) => {
  const { ref, isInView } = useScrollReveal({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6 }
      } : {}}
    >
      <Link to={href} className="group flex flex-col items-center text-center">
        {/* Floating Animation */}
        <motion.div
          animate={{ 
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="relative w-24 h-24 mb-3">
            {/* Animated ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-500"
              whileHover={{ 
                boxShadow: "0 0 20px hsl(var(--primary) / 0.4)"
              }}
            />
            
            {/* Glassmorphic backdrop */}
            <motion.div
              className="absolute inset-0 rounded-full backdrop-blur-sm bg-primary/0 group-hover:bg-primary/10 transition-all duration-300"
            />
            
            <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
              <OptimizedImage
                src={image}
                alt={`${name} location`}
                width={96}
                height={96}
                sizes="96px"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <h3 className="font-medium text-sm mb-0.5">{name}</h3>
        
        {/* Animated Count Badge */}
        <motion.p 
          className="text-xs text-muted-foreground relative"
          whileHover={{ scale: 1.05 }}
        >
          <span className="relative z-10">{count} listings</span>
          <motion.span
            className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.p>
      </Link>
    </motion.div>
  );
};
