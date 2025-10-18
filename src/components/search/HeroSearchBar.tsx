import { useState } from "react";
import { Search, Filter, Calendar as CalendarIcon, Users, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import type { DateRange } from "react-day-picker";

interface SearchParams {
  type: "all" | "stays" | "experiences" | "transport" | "packages";
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
  const [selectedType, setSelectedType] = useState<"all" | "stays" | "experiences" | "transport" | "packages">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    const searchParams = new URLSearchParams();
    if (selectedType !== "all") searchParams.set("type", selectedType);
    if (dateRange?.from) searchParams.set("startDate", dateRange.from.toISOString());
    if (dateRange?.to) searchParams.set("endDate", dateRange.to.toISOString());
    if (guests > 1) searchParams.set("guests", guests.toString());

    onSearch?.({
      type: selectedType,
      startDate: dateRange?.from || null,
      endDate: dateRange?.to || null,
      guests,
    });

    const baseRoutes = {
      all: "/experiences",
      stays: "/stays",
      experiences: "/experiences",
      transport: "/transport",
      packages: "/packages",
    };

    navigate(`${baseRoutes[selectedType]}?${searchParams.toString()}`);
    setIsSearching(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-background dark:bg-card rounded-full shadow-lg border border-border p-2 flex items-center gap-2 relative ${className}`}
    >
      <div className="flex-1 flex items-center gap-2 px-4">
        <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
          <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 p-0 h-auto bg-transparent text-sm text-muted-foreground">
            <SelectValue placeholder="I want to explore" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="stays">Stays</SelectItem>
            <SelectItem value="experiences">Experiences</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="packages">Packages</SelectItem>
          </SelectContent>
        </Select>
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
