import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Star, X, ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  filterType: "stays" | "experiences" | "transport" | "packages" | "events";
  isOpen?: boolean;
  onClose?: () => void;
}

export const FilterSidebar = ({ 
  onFilterChange, 
  filterType, 
  isOpen = true, 
  onClose 
}: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [amenitiesOpen, setAmenitiesOpen] = useState(true);
  
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const prefersReducedMotion = useReducedMotion();

  // Count active filters
  const activeFilterCount = 
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    selectedRatings.length +
    selectedAmenities.length;

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

  const removeFilter = (type: string, value?: any) => {
    if (type === 'price') {
      setPriceRange([0, 1000]);
      onFilterChange({ minPrice: 0, maxPrice: 1000 });
    } else if (type === 'rating' && value) {
      const updated = selectedRatings.filter(r => r !== value);
      setSelectedRatings(updated);
      onFilterChange({ minRating: updated.length > 0 ? Math.min(...updated) : undefined });
    } else if (type === 'amenity' && value) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== value));
    }
  };

  const FilterContent = () => (
    <>
      {/* Active Filters Pills */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2 pb-4 border-b border-border"
        >
          {(priceRange[0] > 0 || priceRange[1] < 1000) && (
            <Badge 
              variant="secondary" 
              className="gap-2 cursor-pointer hover:bg-destructive/10 group transition-colors"
              onClick={() => removeFilter('price')}
            >
              €{priceRange[0]} - €{priceRange[1]}
              <X className="w-3 h-3 group-hover:text-destructive transition-colors" />
            </Badge>
          )}
          
          {selectedRatings.map(rating => (
            <Badge 
              key={rating} 
              variant="secondary"
              className="gap-2 cursor-pointer hover:bg-destructive/10 group transition-colors"
              onClick={() => removeFilter('rating', rating)}
            >
              {rating}+ stars
              <X className="w-3 h-3 group-hover:text-destructive transition-colors" />
            </Badge>
          ))}
          
          {selectedAmenities.map(amenity => (
            <Badge 
              key={amenity} 
              variant="secondary"
              className="gap-2 cursor-pointer hover:bg-destructive/10 group transition-colors"
              onClick={() => removeFilter('amenity', amenity)}
            >
              {amenity}
              <X className="w-3 h-3 group-hover:text-destructive transition-colors" />
            </Badge>
          ))}
        </motion.div>
      )}

      {/* Price Range Section */}
      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 
                                        hover:text-primary transition-colors group">
          <Label className="text-sm font-medium cursor-pointer">Price Range</Label>
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: priceOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 pb-4"
          >
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>
            
            {/* Animated price display */}
            <div className="flex items-center justify-between text-sm">
              <motion.span
                key={priceRange[0]}
                initial={prefersReducedMotion ? {} : { scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-medium text-muted-foreground"
              >
                €{priceRange[0]}
              </motion.span>
              <span className="text-muted-foreground">to</span>
              <motion.span
                key={priceRange[1]}
                initial={prefersReducedMotion ? {} : { scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-medium text-muted-foreground"
              >
                €{priceRange[1]}
              </motion.span>
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rating Section with Animated Checkboxes */}
      <Collapsible open={ratingOpen} onOpenChange={setRatingOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 
                                        hover:text-primary transition-colors border-t border-border">
          <Label className="text-sm font-medium cursor-pointer">Rating</Label>
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: ratingOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <motion.div className="space-y-3 pb-4">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <motion.div
                key={rating}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-2"
              >
                <motion.div
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                >
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={selectedRatings.includes(rating)}
                    onCheckedChange={() => handleRatingToggle(rating)}
                  />
                </motion.div>
                <label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center gap-1 text-sm cursor-pointer 
                             hover:text-primary transition-colors"
                >
                  {Array.from({ length: rating }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.05, type: "spring" }}
                    >
                      <Star className="w-4 h-4 fill-primary text-primary" />
                    </motion.div>
                  ))}
                  <span className="ml-1 text-muted-foreground">& up</span>
                </label>
              </motion.div>
            ))}
          </motion.div>
        </CollapsibleContent>
      </Collapsible>

      {/* Amenities Section (for stays) */}
      {filterType === "stays" && (
        <Collapsible open={amenitiesOpen} onOpenChange={setAmenitiesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 
                                          hover:text-primary transition-colors border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Amenities</Label>
            <motion.div
              animate={prefersReducedMotion ? {} : { rotate: amenitiesOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <motion.div className="space-y-3 pb-4">
              {["WiFi", "Kitchen", "Pool", "Parking", "Air Conditioning"].map((amenity, index) => (
                <motion.div
                  key={amenity}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-2"
                >
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                  >
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAmenities([...selectedAmenities, amenity]);
                        } else {
                          setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                        }
                      }}
                    />
                  </motion.div>
                  <label 
                    htmlFor={`amenity-${amenity}`} 
                    className="text-sm cursor-pointer hover:text-primary transition-colors"
                  >
                    {amenity}
                  </label>
                </motion.div>
              ))}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Experience-specific filters */}
      {filterType === "experiences" && (
        <Collapsible open={amenitiesOpen} onOpenChange={setAmenitiesOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-3 
                                          hover:text-primary transition-colors border-t border-border">
            <Label className="text-sm font-medium cursor-pointer">Difficulty Level</Label>
            <motion.div
              animate={prefersReducedMotion ? {} : { rotate: amenitiesOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <motion.div className="space-y-3 pb-4">
              {["Easy", "Moderate", "Challenging"].map((level, index) => (
                <motion.div
                  key={level}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-2"
                >
                  <Checkbox id={`difficulty-${level}`} />
                  <label htmlFor={`difficulty-${level}`} className="text-sm cursor-pointer">
                    {level}
                  </label>
                </motion.div>
              ))}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </>
  );

  // Desktop: Static sidebar
  if (!isMobile) {
    return (
      <div className="w-full lg:w-80 bg-card border border-border rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Filters</h3>
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-primary text-primary-foreground 
                           text-xs flex items-center justify-center font-semibold"
              >
                {activeFilterCount}
              </motion.div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearAll}
            className="hover:text-destructive transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        </div>
        
        <FilterContent />
      </div>
    );
  }

  // Mobile: Animated drawer
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card 
                       shadow-2xl z-50 overflow-y-auto p-6 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 
                            bg-card pb-4 border-b border-border -mt-6 pt-6 -mx-6 px-6">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">Filters</h3>
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-primary text-primary-foreground 
                               text-xs flex items-center justify-center font-semibold"
                  >
                    {activeFilterCount}
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearAll}
                  className="hover:text-destructive"
                >
                  Clear all
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <FilterContent />
            
            {/* Apply Button (Mobile) */}
            <motion.div
              className="sticky bottom-0 bg-card pt-4 border-t border-border -mb-6 pb-6 -mx-6 px-6"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                className="w-full" 
                size="lg"
                onClick={onClose}
              >
                Show Results
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
