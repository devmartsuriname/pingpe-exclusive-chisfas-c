import { ReactNode, Children } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface AnimatedGridProps {
  children: ReactNode;
  columns?: { base?: number; md?: number; xl?: number };
  staggerDelay?: number;
  className?: string;
}

export const AnimatedGrid = ({
  children,
  columns = { base: 1, md: 2, xl: 3 },
  staggerDelay = 0.1,
  className,
}: AnimatedGridProps) => {
  const { ref, isInView } = useScrollReveal({ threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const gridClasses = cn(
    "grid gap-6",
    columns.base && `grid-cols-${columns.base}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className
  );

  return (
    <div ref={ref} className={gridClasses}>
      {Children.map(children, (child, index) => (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: prefersReducedMotion ? 0 : index * staggerDelay,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};
