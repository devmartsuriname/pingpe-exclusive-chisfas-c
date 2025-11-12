import { useState } from "react";
import { Search, MapPin, Calendar, Users, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const [locationFocused, setLocationFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Demo suggestions
  const suggestions = [
    { id: 1, name: "Paramaribo", country: "Suriname", type: "city" },
    { id: 2, name: "Boven Suriname", country: "Suriname", type: "region" },
    { id: 3, name: "Central Suriname Nature Reserve", country: "Suriname", type: "attraction" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({
      type: activeTab,
      location,
    });
    setShowSuggestions(false);
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
          {/* Location with Dropdown */}
          <div className="relative">
            <motion.div
              className="relative flex items-center"
              animate={prefersReducedMotion ? {} : {
                scale: locationFocused ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : {
                  scale: locationFocused ? 1.1 : 1,
                }}
                className="absolute left-3 z-10 transition-colors"
                style={{
                  color: locationFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                }}
              >
                <MapPin className="h-5 w-5" />
              </motion.div>
              
              <Input
                type="text"
                placeholder="Where to?"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => {
                  setLocationFocused(true);
                  setShowSuggestions(location.length > 0);
                }}
                onBlur={() => {
                  setLocationFocused(false);
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="pl-10 border-0 focus-visible:ring-0 h-12 rounded-lg"
              />
            </motion.div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-border 
                             rounded-xl shadow-xl overflow-hidden z-50 backdrop-blur-xl"
                >
                  {/* Recent Searches */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs font-medium text-muted-foreground">Recent Searches</p>
                    </div>
                    <div className="space-y-1">
                      {suggestions.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setLocation(item.name);
                            setShowSuggestions(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg cursor-pointer 
                                     hover:bg-muted/50 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.country}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs ml-2">
                            {item.type}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
