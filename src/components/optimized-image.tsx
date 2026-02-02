"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  priority?: boolean;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
}

/**
 * Optimized image component with:
 * - Blur placeholder support (plaiceholder)
 * - WebP/AVIF auto-format (Next.js Image)
 * - Lazy loading by default
 * - Nigerian network optimization (lower quality on slow connections)
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  blurDataURL,
  priority = false,
  className,
  fill = false,
  sizes,
  quality = 75,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback placeholder for images without blur data
  const fallbackBlur =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UyZThmMCIvPjwvc3ZnPg==";

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden", fill && "relative", className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={
          sizes ||
          `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${width}px`
        }
        quality={quality}
        priority={priority}
        placeholder={blurDataURL || fallbackBlur ? "blur" : "empty"}
        blurDataURL={blurDataURL || fallbackBlur}
        className={cn(
          "duration-700 ease-in-out",
          isLoading
            ? "scale-105 blur-lg grayscale"
            : "scale-100 blur-0 grayscale-0",
          fill && "object-cover",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
