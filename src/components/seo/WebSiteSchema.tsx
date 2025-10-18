import { Helmet } from "react-helmet-async";

interface WebSiteSchemaProps {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string; // URL template for search, e.g., "https://example.com/search?q={search_term_string}"
}

export function WebSiteSchema({
  name,
  url,
  description,
  searchUrl,
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name,
    url,
    ...(description && { description }),
    ...(searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: searchUrl,
        },
        "query-input": "required name=search_term_string",
      },
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
