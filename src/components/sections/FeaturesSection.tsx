import { Check, Star, Heart, Shield } from "lucide-react";

const iconMap = {
  check: Check,
  star: Star,
  heart: Heart,
  shield: Shield,
};

interface Feature {
  icon?: keyof typeof iconMap;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  content: {
    heading?: string;
    subheading?: string;
    features?: Feature[];
  };
}

export function FeaturesSection({ content }: FeaturesSectionProps) {
  const {
    heading = "Why Choose Us",
    subheading = "Experience the best of Suriname with our unique offerings",
    features = [],
  } = content;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{heading}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subheading}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon ? iconMap[feature.icon] : Star;
            return (
              <div
                key={index}
                className="p-6 rounded-lg border border-border hover:shadow-lg transition-all hover-scale"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}