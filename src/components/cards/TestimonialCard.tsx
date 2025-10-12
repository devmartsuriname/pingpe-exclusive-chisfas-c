import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  quote: string;
  rating: number;
  name: string;
  location: string;
  avatar?: string;
}

export const TestimonialCard = ({
  quote,
  rating,
  name,
  location,
  avatar,
}: TestimonialCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      
      <p className="text-foreground mb-6 leading-relaxed">"{quote}"</p>
      
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-sm">{name}</h4>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
    </div>
  );
};
