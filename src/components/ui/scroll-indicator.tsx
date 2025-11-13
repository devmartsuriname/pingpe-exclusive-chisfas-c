import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Hide after scrolling 100px
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const windowHeight = window.innerHeight;
    window.scrollTo({
      top: windowHeight,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer group"
          aria-label="Scroll to content"
        >
          <div className="glass-badge px-4 py-2 rounded-full animate-scroll-glow">
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      y: [0, 8, 0],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-6 h-6 text-white drop-shadow-glow" />
            </motion.div>
          </div>
          <span className="text-xs text-white/70 font-medium">Scroll</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
