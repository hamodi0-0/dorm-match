"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Camera, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListingImage } from "@/lib/types/listing";

interface ImageCarouselProps {
  images: ListingImage[];
  listingId: string;
  title: string;
}

export function ImageCarousel({
  images,
  listingId,
  title,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.position - b.position;
  });

  const goToPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((i) => (i - 1 + sorted.length) % sorted.length);
    },
    [sorted.length],
  );

  const goToNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((i) => (i + 1) % sorted.length);
    },
    [sorted.length],
  );

  const goToDot = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(idx);
  }, []);

  if (sorted.length === 0) {
    return (
      <Link href={`/dashboard/listings/${listingId}`} className="block h-full">
        <div className="w-full h-full bg-linear-to-br from-muted to-muted/40 flex items-center justify-center">
          <Home className="h-10 w-10 text-muted-foreground/20" />
        </div>
      </Link>
    );
  }

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden">
      {/* Images */}
      <Link href={`/dashboard/listings/${listingId}`} className="block h-full">
        <div className="relative w-full h-full">
          {sorted.map((img, idx) => (
            <div
              key={img.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                idx === currentIndex
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none",
              )}
            >
              <Image
                src={img.public_url}
                alt={`${title} - photo ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
      </Link>

      {/* Prev / Next arrows — only visible on hover */}
      {sorted.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            aria-label="Previous photo"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10",
              "w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200",
              "hover:bg-black/70",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNext}
            aria-label="Next photo"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10",
              "w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center",
              "opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200",
              "hover:bg-black/70",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Photo count badge */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
        <Camera className="h-3 w-3" />
        <span>{sorted.length}</span>
      </div>

      {/* Dot indicators */}
      {sorted.length > 1 && sorted.length <= 8 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
          {sorted.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => goToDot(e, idx)}
              aria-label={`Go to photo ${idx + 1}`}
              className={cn(
                "rounded-full transition-all duration-200",
                idx === currentIndex
                  ? "w-2 h-2 bg-white"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
