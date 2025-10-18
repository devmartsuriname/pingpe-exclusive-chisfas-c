import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { LucideIcon } from "lucide-react";

interface IllustratedStepProps {
  image?: string;
  icon?: LucideIcon;
  title: string;
  description: string;
}

export const IllustratedStep = ({ image, icon: Icon, title, description }: IllustratedStepProps) => {
  return (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
        {Icon ? (
          <Icon className="w-16 h-16 text-primary" />
        ) : image ? (
          <OptimizedImage
            src={image}
            alt={`${title} illustration`}
            width={96}
            height={96}
            sizes="96px"
            className="w-24 h-24 object-contain"
          />
        ) : null}
      </div>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
