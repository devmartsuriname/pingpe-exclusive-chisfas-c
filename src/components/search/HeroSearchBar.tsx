import { useState, useEffect } from "react";
import { Search, MapPin, Calendar as CalendarIcon, Users, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { DateRange } from "react-day-picker";

interface SearchParams {
  location: string;
  startDate: Date | null;
  endDate: Date | null;
  guests: number;
}

interface HeroSearchBarProps {
  onSearch?: (params: SearchParams) => void;
  className?: string;
}

export const HeroSearchBar = ({ onSearch, className }: HeroSearchBarProps) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Location autocomplete
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (location.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      const { data } = await supabase
        .from("properties")
        .select("city, country")
        .or(`city.ilike.%${location}%,country.ilike.%${location}%`)
        .limit(5);

      const uniqueLocations = Array.from(
        new Set(data?.map((p) => `${p.city}, ${p.country}`))
      );

      setSuggestions(uniqueLocations);
      setShowSuggestions(uniqueLocations.length > 0);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    const searchParams = new URLSearchParams();
    if (location) searchParams.set("location", location);
    if (dateRange?.from) searchParams.set("startDate", dateRange.from.toISOString());
    if (dateRange?.to) searchParams.set("endDate", dateRange.to.toISOString());
    if (guests > 1) searchParams.set("guests", guests.toString());

    onSearch?.({
      location,
      startDate: dateRange?.from || null,
      endDate: dateRange?.to || null,
      guests,
    });

    navigate(`/experiences?${searchParams.toString()}`);
    setIsSearching(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-background dark:bg-card rounded-full shadow-lg border border-border p-2 flex items-center gap-2 relative ${className}`}
    >
      <div className="flex-1 flex items-center gap-2 px-4 relative">
        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <Input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent"
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg z-50 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="px-4 py-3 hover:bg-muted cursor-pointer transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                onMouseDown={() => {
                  setLocation(suggestion);
                  setShowSuggestions(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date Picker */}
      <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
        <PopoverTrigger asChild>
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-border cursor-pointer hover:bg-muted/50 transition-colors rounded-lg">
            <CalendarIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                : "Dates"}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            disabled={(date) => date < new Date()}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Guest Counter */}
      <Popover open={showGuestPicker} onOpenChange={setShowGuestPicker}>
        <PopoverTrigger asChild>
          <div className="hidden md:flex items-center gap-2 px-4 border-l border-border cursor-pointer hover:bg-muted/50 transition-colors rounded-lg">
            <Users className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {guests} {guests === 1 ? "Guest" : "Guests"}
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Guests</div>
                <div className="text-sm text-muted-foreground">Number of travelers</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{guests}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setGuests(Math.min(20, guests + 1))}
                  disabled={guests >= 20}
                  className="h-8 w-8"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        type="submit"
        size="icon"
        className="rounded-full h-12 w-12 flex-shrink-0"
        aria-label="Search"
        disabled={isSearching}
      >
        {isSearching ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </Button>
    </form>
  );
};
