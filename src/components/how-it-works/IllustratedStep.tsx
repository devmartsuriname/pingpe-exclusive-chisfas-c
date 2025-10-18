import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface IllustratedStepProps {
  image: string;
  title: string;
  description: string;
}

export const IllustratedStep = ({ image, title, description }: IllustratedStepProps) => {
  return (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center overflow-hidden">
        <OptimizedImage
          src={image}
          alt={`${title} illustration`}
          width={96}
          height={96}
          sizes="96px"
          className="w-24 h-24 object-contain"
        />
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
