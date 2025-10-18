import { Helmet } from "react-helmet-async";

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string[];
  url: string;
  price: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "SoldOut";
  rating?: {
    ratingValue: number;
    reviewCount: number;
  };
  brand?: string;
  category?: string;
}

export function ProductSchema({
  name,
  description,
  image,
  url,
  price,
  priceCurrency = "USD",
  availability = "InStock",
  rating,
  brand,
  category,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url,
    ...(brand && { brand: { "@type": "Brand", name: brand } }),
    ...(category && { category }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
    },
    ...(rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating.ratingValue,
        reviewCount: rating.reviewCount,
      },
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
