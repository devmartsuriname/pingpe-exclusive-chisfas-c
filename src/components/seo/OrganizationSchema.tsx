import { Helmet } from "react-helmet-async";

interface OrganizationSchemaProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  foundingDate?: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressCountry: string;
  };
  sameAs?: string[]; // Social media profiles
}

export function OrganizationSchema({
  name,
  description,
  url,
  logo,
  foundingDate,
  email,
  phone,
  address,
  sameAs = [],
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name,
    description,
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
    ...(foundingDate && { foundingDate }),
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.streetAddress,
        addressLocality: address.addressLocality,
        addressCountry: address.addressCountry,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
