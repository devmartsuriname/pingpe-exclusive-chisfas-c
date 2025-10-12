import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <Link
      to={`/hosts/${id}`}
      className="group flex flex-col items-center p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      <Avatar className="w-20 h-20 mb-4">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
      </Avatar>
      
      <h3 className="font-semibold text-base mb-1 text-center">{name}</h3>
      
      <div className="flex items-center gap-1 mb-1">
        <Star className="w-4 h-4 fill-primary text-primary" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">{location}</p>
    </Link>
  );
};
