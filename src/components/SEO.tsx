import { Helmet } from "react-helmet";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  url?: string;
}

export default function SEO({
  title = "Jungle Resort PingPe - Authentic Upper Suriname Experience",
  description = "Experience authentic rainforest adventures at Jungle Resort PingPe. Eco-friendly accommodations, guided jungle tours, and immersive cultural experiences in Upper Suriname.",
  image = "https://www.jungleresortpingpe.com/images/hero.jpg",
  type = "website",
  url = "https://www.jungleresortpingpe.com",
}: SEOProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Resort",
    "name": "Jungle Resort PingPe",
    "description": description,
    "image": image,
    "url": url,
    "telephone": "+597-123-4567",
    "email": "info@jungleresortpingpe.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Upper Suriname River",
      "addressRegion": "Sipaliwini",
      "addressCountry": "SR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "4.5",
      "longitude": "-55.5"
    },
    "priceRange": "$$$",
    "servesCuisine": "Local Surinamese",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "River Access",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Guided Tours",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Traditional Accommodations",
        "value": true
      }
    ],
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": url + "/stays"
      }
    }
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Jungle Resort PingPe" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="keywords" content="suriname jungle resort, upper suriname, eco tourism, rainforest adventures, pingpe, authentic experiences, jungle lodges" />
      <meta name="author" content="Jungle Resort PingPe" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
