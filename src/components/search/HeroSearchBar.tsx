import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSearchBarProps {
  onSearch?: (params: { location: string }) => void;
}

export const HeroSearchBar = ({ onSearch }: HeroSearchBarProps) => {
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({ location });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-full shadow-lg border border-border p-2 flex items-center gap-2"
    >
      <div className="flex-1 flex items-center gap-2 px-4">
        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <Input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
        />
      </div>

      <div className="hidden md:flex items-center gap-2 px-4 border-l border-border">
        <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground">Dates</span>
      </div>

      <div className="hidden md:flex items-center gap-2 px-4 border-l border-border">
        <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground">Guests</span>
      </div>

      <Button type="submit" size="icon" className="rounded-full h-12 w-12 flex-shrink-0">
        <Search className="w-5 h-5" />
      </Button>
    </form>
  );
};
