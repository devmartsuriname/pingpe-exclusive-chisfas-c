import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspectRatio?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  sizes = "100vw",
  className,
  aspectRatio,
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  // Treat Vite dev/prod asset URLs and data URLs as static assets
  const isStaticAsset = !!src && (
    /^\/(assets|src|demo-content)\//.test(src) || 
    src.startsWith("/@fs/") || 
    src.startsWith("/") || 
    src.startsWith("./") || 
    src.startsWith("../") || 
    src.startsWith("data:")
  );

  // Build correct fetchpriority attribute (lowercase) without React warning
  const fetchPriorityAttr = priority ? { fetchpriority: "high" } : { fetchpriority: "auto" };

  // Generate WebP URL by replacing extension (for dynamic/external URLs only)
  const getWebPUrl = (url: string) => {
    if (!url) return url;
    // Check if URL already has webp in query params or is already webp
    if (url.includes("webp") || url.endsWith(".webp")) return url;
    // For Supabase storage URLs, we'll append a transform parameter externally (no change here)
    if (url.includes("supabase.co")) {
      return url; // Supabase will handle transforms via their API
    }
    // For other URLs, try to replace extension
    return url.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  };

  // Generate srcset for different viewport sizes
  const generateSrcSet = (url: string, sizes: number[] = [640, 768, 1024, 1280, 1920]) => {
    if (!url || url.includes("supabase.co")) {
      // For Supabase, use transform API
      return sizes.map((w) => `${url}?width=${w} ${w}w`).join(", ");
    }
    return sizes.map((w) => `${url} ${w}w`).join(", ");
  };

  if (error || !src) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground",
          className
        )}
        style={{ aspectRatio }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  // For static assets (Vite-processed), use simple img tag (no transforms)
  if (isStaticAsset) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onError={() => setError(true)}
        className={cn(className)}
        style={{ aspectRatio }}
        {...fetchPriorityAttr}
      />
    );
  }

  // For dynamic URLs (Supabase, external), use picture element with srcset
  const webpUrl = getWebPUrl(src);
  const srcSet = generateSrcSet(src);
  const webpSrcSet = generateSrcSet(webpUrl);

  return (
    <picture>
      {/* WebP source with srcset */}
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />

      {/* Fallback to original format */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onError={() => setError(true)}
        className={cn(className)}
        style={{ aspectRatio }}
        {...fetchPriorityAttr}
      />
    </picture>
  );
}
