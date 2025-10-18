import { useState } from "react";
import { ChevronLeft, ChevronRight, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title,
        url: window.location.href,
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        {/* Main Image */}
        <div
          className="col-span-4 md:col-span-2 md:row-span-2 relative cursor-pointer group overflow-hidden"
          onClick={() => {
            setSelectedImage(0);
            setIsLightboxOpen(true);
          }}
        >
          <OptimizedImage
            src={images[0] || "/placeholder.svg"}
            alt={`${title} - Main`}
            priority={true}
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="w-full h-full object-cover aspect-[4/3] md:aspect-auto transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Thumbnails */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative cursor-pointer group overflow-hidden"
            onClick={() => {
              setSelectedImage(index + 1);
              setIsLightboxOpen(true);
            }}
          >
            <OptimizedImage
              src={image}
              alt={`${title} - ${index + 2}`}
              width={400}
              height={400}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Share Button */}
      <div className="flex justify-end mt-4">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black/95 border-0">
          <Carousel
            opts={{
              startIndex: selectedImage,
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="flex items-center justify-center p-8">
                    <OptimizedImage
                      src={image}
                      alt={`${title} - ${index + 1}`}
                      width={1920}
                      height={1080}
                      priority={index === selectedImage}
                      sizes="100vw"
                      className="max-h-[80vh] w-auto object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setIsLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
