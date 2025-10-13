import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function SitemapXML() {
  const [xml, setXml] = useState<string>("");

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("generate-sitemap");
        
        if (error) throw error;
        
        // The edge function returns XML as text
        setXml(data);
      } catch (error) {
        console.error("Error generating sitemap:", error);
        setXml(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.jungleresortpingpe.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
      }
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (xml) {
      // Set content type to XML
      const blob = new Blob([xml], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      
      // Trigger download or display
      window.location.href = url;
    }
  }, [xml]);

  return (
    <div className="p-4">
      <h1>Generating Sitemap...</h1>
      {xml && <pre className="text-xs">{xml}</pre>}
    </div>
  );
}
