import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatCard({ title, value, change, icon: Icon, iconColor = "text-primary" }: StatCardProps) {
  // Count-up animation for numeric values
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : 
                       parseInt(value.toString().replace(/[^0-9]/g, ''));

  useEffect(() => {
    if (!isNaN(numericValue)) {
      const controls = animate(0, numericValue, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.floor(latest))
      });
      return controls.stop;
    }
  }, [numericValue]);

  const displayText = typeof value === 'number' ? displayValue : value;

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 0 30px hsl(var(--primary) / 0.2)"
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden group">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className={cn("h-5 w-5", iconColor)} />
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="text-2xl font-bold">{displayText}</div>
          {change && (
            <p className={cn("text-xs mt-1", change.isPositive ? "text-green-600" : "text-red-600")}>
              {change.isPositive ? "+" : ""}{change.value}% from last month
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
