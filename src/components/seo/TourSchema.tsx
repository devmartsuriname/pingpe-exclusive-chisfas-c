import { Helmet } from "react-helmet-async";

interface TourSchemaProps {
  tour: {
    title: string;
    description: string;
    price_per_person: number;
    duration_days?: number;
    duration_hours?: number;
    images?: string[];
    keywords?: string[];
    tour_type?: string;
    max_participants: number;
    meeting_point: string;
    includes?: string[];
    difficulty_level?: string;
  };
  url: string;
}

export function TourSchema({ tour, url }: TourSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "url": url,
    "image": tour.images || [],
    "keywords": tour.keywords?.join(", ") || "",
    "touristType": "Individual, Group",
    "itinerary": {
      "@type": "ItemList",
      "name": `${tour.title} Itinerary`,
      "numberOfItems": tour.duration_days || 1
    },
    "offers": {
      "@type": "Offer",
      "price": tour.price_per_person.toString(),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0],
      "description": `Price per person for ${tour.title}`,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": tour.price_per_person.toString(),
        "priceCurrency": "EUR",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": "1",
          "unitText": "person"
        }
      }
    },
    "duration": tour.duration_days 
      ? `P${tour.duration_days}D`
      : `PT${tour.duration_hours}H`,
    "maximumAttendeeCapacity": tour.max_participants,
    "location": {
      "@type": "Place",
      "name": tour.meeting_point,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SR",
        "addressRegion": "Boven-Suriname"
      }
    },
    "provider": {
      "@type": "TravelAgency",
      "name": "Jungle Resort PingPe",
      "url": "https://www.jungleresortpingpe.com",
      "logo": "https://www.jungleresortpingpe.com/logo.png",
      "telephone": "+597-8858525",
      "email": "info@jungleresortpingpe.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Vidijaweg 25",
        "addressLocality": "Wanica",
        "addressRegion": "Boven-Suriname",
        "addressCountry": "SR"
      }
    },
    "category": tour.tour_type || "standard-tour",
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Difficulty Level",
        "value": tour.difficulty_level || "Moderate"
      },
      {
        "@type": "PropertyValue",
        "name": "Tour Type",
        "value": tour.tour_type === "back-to-basic" ? "Back-to-Basic Expedition" : tour.tour_type === "combination" ? "Combination Tour" : "Standard Tour"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "28",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Guest Review"
      },
      "reviewBody": "An authentic and unforgettable jungle experience in the heart of Suriname."
    }
  };

  // Add includes if available
  if (tour.includes && tour.includes.length > 0) {
    schema["includesObject"] = tour.includes.map(item => ({
      "@type": "Thing",
      "name": item
    }));
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
