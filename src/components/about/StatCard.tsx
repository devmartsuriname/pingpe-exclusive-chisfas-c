import { LucideIcon } from "lucide-react";
import { CountUpAnimation } from "@/components/animations/CountUpAnimation";

interface StatCardProps {
  number: number;
  suffix?: string;
  prefix?: string;
  label: string;
  icon?: LucideIcon;
  decimals?: number;
}

export const StatCard = ({
  number,
  suffix = "",
  prefix = "",
  label,
  icon: Icon,
  decimals = 0,
}: StatCardProps) => {
  return (
    <div className="text-center group">
      <div className="relative inline-block mb-4">
        {Icon && (
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
        )}
        {Icon && (
          <div className="relative bg-background/80 backdrop-blur-sm border border-border rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        )}
      </div>
      
      <CountUpAnimation
        end={number}
        suffix={suffix}
        prefix={prefix}
        decimals={decimals}
        duration={2.5}
        className="text-4xl md:text-5xl font-bold text-foreground mb-2"
      />
      
      <p className="text-muted-foreground text-sm md:text-base font-medium">
        {label}
      </p>
    </div>
  );
};
