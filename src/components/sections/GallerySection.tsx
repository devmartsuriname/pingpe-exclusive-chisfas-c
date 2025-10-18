import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface GallerySectionProps {
  content: {
    heading?: string;
    images?: string[];
  };
}

export function GallerySection({ content }: GallerySectionProps) {
  const { heading = "Gallery", images = [] } = content;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">{heading}</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden hover-scale cursor-pointer"
            >
              <OptimizedImage
                src={image}
                alt={`Gallery image ${index + 1}`}
                width={400}
                height={400}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}