import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Lightbox } from "./Lightbox";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface GalleryImage {
  src: string;
  category: string;
  caption?: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  categories?: string[];
}

export const PhotoGallery = ({
  images,
  categories = ["All"],
}: PhotoGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const allCategories = ["All", ...categories];

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
    );
  };

  return (
    <div className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredImages.map((image, index) => (
          <motion.div
            key={`${image.src}-${index}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <OptimizedImage
                src={image.src}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="text-white text-center p-4"
                >
                  {image.caption && (
                    <p className="text-sm font-medium">{image.caption}</p>
                  )}
                  <p className="text-xs text-white/70 mt-1">Click to view</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        images={filteredImages}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </div>
  );
};
