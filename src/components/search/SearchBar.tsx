import { useState } from "react";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
  className?: string;
}

export interface SearchParams {
  type: string;
  location: string;
  dates?: { from?: Date; to?: Date };
  guests?: number;
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [activeTab, setActiveTab] = useState("stays");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({
      type: activeTab,
      location,
    });
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      {/* Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50 p-1">
          <TabsTrigger value="stays">Stays</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-xl shadow-lg border border-border p-2"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {/* Location */}
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 border-0 focus-visible:ring-0 h-12"
            />
          </div>

          {/* Dates */}
          <div className="relative flex items-center">
            <Calendar className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Check-in - Check-out"
              className="pl-10 border-0 focus-visible:ring-0 h-12"
            />
          </div>

          {/* Guests */}
          <div className="relative flex items-center">
            <Users className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Add guests"
              className="pl-10 border-0 focus-visible:ring-0 h-12"
            />
          </div>

          {/* Search Button */}
          <Button type="submit" size="lg" className="h-12 w-full">
            <Search className="h-5 w-5 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
