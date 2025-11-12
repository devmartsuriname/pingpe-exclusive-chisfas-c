import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, success, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);
    const prefersReducedMotion = useReducedMotion();

    // Simple input without animations if no label/icon
    if (!label && !icon && !error && !success) {
      return (
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base",
            "ring-offset-background file:border-0 file:bg-transparent",
            "file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "transition-all duration-200",
            className
          )}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full">
        {/* Floating Label */}
        {label && (
          <motion.label
            htmlFor={props.id}
            animate={prefersReducedMotion ? {} : {
              y: isFocused || hasValue ? -24 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 origin-left pointer-events-none text-sm font-medium z-10 transition-colors",
              error ? "text-destructive" : 
              success ? "text-green-600" : 
              isFocused ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </motion.label>
        )}

        {/* Icon with animation */}
        {icon && (
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 transition-colors"
            animate={prefersReducedMotion ? {} : {
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
            style={{
              color: error ? "hsl(var(--destructive))" : 
                     success ? "rgb(34, 197, 94)" : 
                     isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
          >
            {icon}
          </motion.div>
        )}

        {/* Input with focus ring animation */}
        <motion.div
          className="relative"
          animate={prefersReducedMotion ? {} : {
            scale: error ? [1, 1.02, 0.98, 1.01, 1] : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base",
              "ring-offset-background file:border-0 file:bg-transparent",
              "file:text-sm file:font-medium file:text-foreground",
              "placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "transition-all duration-200",
              icon && "pl-10",
              label && "pt-4",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-green-500 focus-visible:ring-green-500",
              !error && !success && "border-input focus-visible:ring-ring",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              setHasValue(!!e.target.value);
            }}
            onChange={(e) => {
              setHasValue(!!e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />

          {/* Animated underline */}
          {!prefersReducedMotion && (
            <motion.div
              className="absolute bottom-0 left-0 h-0.5"
              initial={{ width: "0%" }}
              animate={{
                width: isFocused ? "100%" : "0%",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                backgroundColor: error ? "hsl(var(--destructive))" : 
                               success ? "rgb(34, 197, 94)" : "hsl(var(--primary))"
              }}
            />
          )}

          {/* Success/Error glow */}
          {!prefersReducedMotion && (success || error) && (
            <motion.div
              className={cn(
                "absolute inset-0 rounded-md blur-md -z-10",
                success && "bg-green-500/30",
                error && "bg-destructive/30"
              )}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Error message with slide down */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-destructive mt-1 flex items-center gap-1"
          >
            <span>⚠</span> {error}
          </motion.p>
        )}

        {/* Success message */}
        {success && !error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-600 mt-1 flex items-center gap-1"
          >
            <span>✓</span> Looks good!
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
