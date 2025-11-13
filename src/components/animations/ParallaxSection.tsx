import { ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  speed?: number; // 0 = no movement, 1 = normal scroll, 0.5 = half speed
  overlay?: "dark" | "light" | "none";
  className?: string;
}

export const ParallaxSection = ({
  children,
  backgroundImage,
  speed = 0.5,
  overlay = "dark",
  className = "",
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-50 * speed, 50 * speed]
  );

  const overlayClasses = {
    dark: "bg-black/50",
    light: "bg-white/50",
    none: "",
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {backgroundImage && (
        <motion.div
          style={{ y }}
          className="absolute inset-0 -z-10"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              height: "120%",
              top: "-10%",
            }}
          />
          {overlay !== "none" && (
            <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
          )}
        </motion.div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
