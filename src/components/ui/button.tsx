import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useRipple } from "@/components/ui/ripple";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/50 hover:scale-105 active:scale-100 font-semibold",
        gradient: "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] text-primary-foreground hover:bg-right-bottom hover:scale-105 active:scale-100 font-medium animate-gradient-shift",
        glass: "bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] text-foreground hover:bg-[var(--glass-bg)]/80 hover:border-[var(--glass-border)]/80 shadow-[var(--glass-shadow)]",
        glow: "bg-primary text-primary-foreground shadow-lg hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] hover:scale-105 active:scale-100 animate-pulse-glow",
        "3d": "bg-primary text-primary-foreground shadow-[0_6px_0_hsl(var(--primary)/0.8)] hover:shadow-[0_4px_0_hsl(var(--primary)/0.8)] hover:translate-y-[2px] active:shadow-[0_2px_0_hsl(var(--primary)/0.8)] active:translate-y-[4px] transition-all",
        hero: "bg-gradient-to-r from-primary via-primary-hover to-accent text-primary-foreground hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] font-bold text-base",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[40px]",
        sm: "h-9 rounded-md px-3 min-h-[36px]",
        lg: "h-11 rounded-md px-8 min-h-[44px]",
        xl: "h-14 rounded-lg px-10 min-h-[56px] text-base",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const { createRipple, RippleContainer } = useRipple({
      duration: 600,
      color: variant === "default" || variant === "premium" || variant === "hero" || variant === "gradient" || variant === "glow" || variant === "3d"
        ? "rgba(255, 255, 255, 0.3)" 
        : "rgba(0, 0, 0, 0.1)"
    });

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!asChild) {
        createRipple(e);
      }
      onClick?.(e);
    };

    const Comp = asChild ? Slot : "button";
    
    // When asChild is true, Slot expects a single child, so don't add RippleContainer
    if (asChild) {
      return (
        <Comp 
          className={cn(buttonVariants({ variant, size, className }))} 
          ref={ref} 
          onClick={handleClick}
          {...props}
        />
      );
    }
    
    // When asChild is false, we can add ripple effect
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")} 
        ref={ref} 
        onClick={handleClick}
        {...props}
      >
        {props.children}
        <RippleContainer />
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
