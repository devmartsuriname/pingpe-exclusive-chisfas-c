import { Helmet } from "react-helmet";

export type SchemaType = 
  | 'WebPage' 
  | 'Article' 
  | 'BlogPosting' 
  | 'Product' 
  | 'Resort' 
  | 'Event'
  | 'Place';

interface Author {
  name: string;
  url?: string;
}

interface HrefLang {
  lang: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  url?: string;
  schemaType?: SchemaType;
  author?: Author;
  datePublished?: string;
  dateModified?: string;
  canonicalUrl?: string;
  hrefLang?: HrefLang[];
  keywords?: string[];
}

const BASE_URL = "https://www.jungleresortpingpe.com";

export default function SEO({
  title = "Jungle Resort PingPe - Authentic Upper Suriname Experience",
  description = "Experience authentic rainforest adventures at Jungle Resort PingPe. Eco-friendly accommodations, guided jungle tours, and immersive cultural experiences in Upper Suriname.",
  image = "https://www.jungleresortpingpe.com/images/hero.jpg",
  type = "website",
  url,
  schemaType = 'Resort',
  author,
  datePublished,
  dateModified,
  canonicalUrl,
  hrefLang,
  keywords = [
    "suriname jungle resort",
    "upper suriname",
    "eco tourism",
    "rainforest adventures",
    "pingpe",
    "authentic experiences",
    "jungle lodges"
  ],
}: SEOProps) {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : BASE_URL);
  const canonical = canonicalUrl || fullUrl;

  // Generate structured data based on schema type
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "name": title,
      "description": description,
      "image": image,
      "url": fullUrl,
    };

    switch (schemaType) {
      case 'BlogPosting':
      case 'Article':
        return {
          ...baseData,
          "@type": "BlogPosting",
          "headline": title,
          "datePublished": datePublished,
          "dateModified": dateModified || datePublished,
          "author": author ? {
            "@type": "Person",
            "name": author.name,
            ...(author.url && { "url": author.url })
          } : {
            "@type": "Organization",
            "name": "Jungle Resort PingPe"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Jungle Resort PingPe",
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/images/logo.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          }
        };

      case 'WebPage':
        return {
          ...baseData,
          "@type": "WebPage",
          "datePublished": datePublished,
          "dateModified": dateModified || datePublished,
          "publisher": {
            "@type": "Organization",
            "name": "Jungle Resort PingPe"
          }
        };

      case 'Product':
        return {
          ...baseData,
          "@type": "Product",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "url": fullUrl
          }
        };

      case 'Event':
        return {
          ...baseData,
          "@type": "Event",
          "startDate": datePublished,
          "location": {
            "@type": "Place",
            "name": "Jungle Resort PingPe",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Upper Suriname River",
              "addressRegion": "Sipaliwini",
              "addressCountry": "SR"
            }
          }
        };

      case 'Resort':
      default:
        return {
          ...baseData,
          "@type": "Resort",
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
              "urlTemplate": BASE_URL + "/stays"
            }
          }
        };
    }
  };

  const structuredData = generateStructuredData();

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Alternate Languages */}
      {hrefLang && hrefLang.map(({ lang, url: langUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={langUrl} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="Jungle Resort PingPe" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional Meta Tags */}
      <meta name="author" content={author?.name || "Jungle Resort PingPe"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#10b981" />
    </Helmet>
  );
}
