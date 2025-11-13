import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, MapPin, Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const contentVariants = {
  hidden: { y: "-100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const popularDestinations = [
  "Brownsberg Nature Park",
  "Galibi Beach",
  "Central Suriname Nature Reserve",
  "Paramaribo City Tour",
  "Commewijne River",
];

const recentSearches = [
  "Rainforest Lodge",
  "River Safari",
  "Bird Watching Tour",
];

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="glass-card rounded-3xl p-6 md:p-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Search PingPe</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Search Input */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Where do you want to go?"
                    className="pl-12 pr-4 py-6 text-lg rounded-2xl bg-background/50 border-border/50"
                  />
                </div>

                {/* Tabs */}
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="grid grid-cols-4 w-full mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="stays">Stays</TabsTrigger>
                    <TabsTrigger value="experiences">Experiences</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-6">
                    {/* Quick Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Button variant="outline" className="justify-start gap-2">
                        <Calendar className="w-4 h-4" />
                        Any dates
                      </Button>
                      <Button variant="outline" className="justify-start gap-2">
                        <Users className="w-4 h-4" />
                        Add guests
                      </Button>
                      <Button variant="outline" className="justify-start gap-2">
                        <MapPin className="w-4 h-4" />
                        Any location
                      </Button>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <h3 className="font-semibold text-sm text-foreground">Recent Searches</h3>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors text-foreground"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Destinations */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm text-foreground">Popular Destinations</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {popularDestinations.map((destination, index) => (
                          <button
                            key={index}
                            className="text-left px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors text-foreground"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              {destination}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stays">
                    <p className="text-muted-foreground text-center py-8">
                      Search for accommodations...
                    </p>
                  </TabsContent>

                  <TabsContent value="experiences">
                    <p className="text-muted-foreground text-center py-8">
                      Search for experiences...
                    </p>
                  </TabsContent>

                  <TabsContent value="transport">
                    <p className="text-muted-foreground text-center py-8">
                      Search for transportation...
                    </p>
                  </TabsContent>
                </Tabs>

                {/* Keyboard Hint */}
                <div className="text-center text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-muted rounded text-xs">ESC</kbd> to close
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
