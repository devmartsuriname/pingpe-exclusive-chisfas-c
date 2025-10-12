import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, X } from "lucide-react";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  filterType: "stays" | "experiences" | "transport" | "packages" | "events";
}

export const FilterSidebar = ({ onFilterChange, filterType }: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleClearAll = () => {
    setPriceRange([0, 1000]);
    setSelectedRatings([]);
    setSelectedAmenities([]);
    onFilterChange({});
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleRatingToggle = (rating: number) => {
    const updated = selectedRatings.includes(rating)
      ? selectedRatings.filter((r) => r !== rating)
      : [...selectedRatings, rating];
    setSelectedRatings(updated);
    onFilterChange({ minRating: Math.min(...updated) });
  };

  return (
    <div className="w-full lg:w-80 bg-card border border-border rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          <X className="w-4 h-4 mr-1" />
          Clear all
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={1000}
            step={10}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>€{priceRange[0]}</span>
          <span>€{priceRange[1]}</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Rating</Label>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-2">
            <Checkbox
              id={`rating-${rating}`}
              checked={selectedRatings.includes(rating)}
              onCheckedChange={() => handleRatingToggle(rating)}
            />
            <label
              htmlFor={`rating-${rating}`}
              className="flex items-center gap-1 text-sm cursor-pointer"
            >
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
              <span className="ml-1 text-muted-foreground">& up</span>
            </label>
          </div>
        ))}
      </div>

      {/* Stay-specific filters */}
      {filterType === "stays" && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          {["WiFi", "Kitchen", "Pool", "Parking", "Air Conditioning"].map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAmenities([...selectedAmenities, amenity]);
                  } else {
                    setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                  }
                }}
              />
              <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Experience-specific filters */}
      {filterType === "experiences" && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Difficulty Level</Label>
          {["Easy", "Moderate", "Challenging"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox id={`difficulty-${level}`} />
              <label htmlFor={`difficulty-${level}`} className="text-sm cursor-pointer">
                {level}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
