import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, success, maxLength, autoResize = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [charCount, setCharCount] = React.useState(props.value?.toString().length || 0);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const prefersReducedMotion = useReducedMotion();

    // Auto-resize function
    const handleResize = React.useCallback(() => {
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [autoResize]);

    React.useEffect(() => {
      handleResize();
    }, [props.value, handleResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      handleResize();
      props.onChange?.(e);
    };

    // Simple textarea without animations if no label
    if (!label && !error && !success) {
      return (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background placeholder:text-muted-foreground resize-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            className
          )}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          onChange={handleChange}
          maxLength={maxLength}
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
              y: isFocused || charCount > 0 ? -24 : 12,
              scale: isFocused || charCount > 0 ? 0.85 : 1,
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute left-3 origin-left pointer-events-none text-sm font-medium z-10 transition-colors",
              error ? "text-destructive" : 
              success ? "text-green-600" : 
              isFocused ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </motion.label>
        )}

        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: error ? [1, 1.01, 0.99, 1.005, 1] : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <textarea
            className={cn(
              "flex min-h-[80px] w-full rounded-md border bg-background",
              "px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground resize-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200",
              label && "pt-6",
              error && "border-destructive focus-visible:ring-destructive",
              success && "border-green-500 focus-visible:ring-green-500",
              !error && !success && "border-input focus-visible:ring-ring",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              className
            )}
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />

          {/* Character count */}
          {maxLength && (
            <motion.div
              className="absolute bottom-2 right-3 text-xs"
              animate={prefersReducedMotion ? {} : {
                scale: charCount === maxLength ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.2 }}
              style={{
                color: charCount > maxLength * 0.9 
                  ? "hsl(var(--destructive))" 
                  : "hsl(var(--muted-foreground))"
              }}
            >
              {charCount} / {maxLength}
            </motion.div>
          )}

          {/* Focus glow */}
          {!prefersReducedMotion && isFocused && (
            <motion.div
              className="absolute inset-0 rounded-md blur-md -z-10 bg-primary/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-destructive mt-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
