import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface HostCardProps {
  id: string;
  name: string;
  rating: number;
  location: string;
  avatar?: string;
}

export const HostCard = ({ id, name, rating, location, avatar }: HostCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const { ref, isInView } = useScrollReveal({ threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link
        to={`/hosts/${id}`}
        className="group relative flex flex-col items-center p-6 backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl overflow-hidden hover:bg-card/90 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 block"
      >
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 blur-xl -z-10"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Animated Avatar with Ring */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative mb-4"
        >
          {/* Animated glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-md -z-10"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <Avatar className="w-20 h-20 border-2 border-background shadow-xl">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        
        <h3 className="font-semibold text-base mb-1 text-center relative z-10">{name}</h3>
        
        {/* Animated Rating Star */}
        <div className="flex items-center gap-1 mb-1 relative z-10">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star className="w-4 h-4 fill-primary text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
          </motion.div>
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
        
        <p className="text-sm text-muted-foreground text-center relative z-10">{location}</p>
      </Link>
    </motion.div>
  );
};
