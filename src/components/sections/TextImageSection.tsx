import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface TextImageSectionProps {
  content: {
    heading?: string;
    text?: string;
    image?: string;
    imagePosition?: "left" | "right";
    buttonText?: string;
    buttonLink?: string;
  };
}

export function TextImageSection({ content }: TextImageSectionProps) {
  const {
    heading = "Our Story",
    text = "Discover the beauty of untouched nature",
    image,
    imagePosition = "right",
    buttonText,
    buttonLink,
  } = content;

  const textContent = (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold">{heading}</h2>
      <p className="text-lg text-muted-foreground leading-relaxed">{text}</p>
      {buttonText && buttonLink && (
        <Button asChild>
          <a href={buttonLink}>{buttonText}</a>
        </Button>
      )}
    </div>
  );

  const imageContent = image ? (
    <div className="rounded-lg overflow-hidden">
      <OptimizedImage 
        src={image} 
        alt={heading} 
        width={800}
        height={600}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="w-full h-full object-cover" 
      />
    </div>
  ) : (
    <div className="rounded-lg bg-muted h-[400px]" />
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {imagePosition === "left" ? (
            <>
              {imageContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {imageContent}
            </>
          )}
        </div>
      </div>
    </section>
  );
}