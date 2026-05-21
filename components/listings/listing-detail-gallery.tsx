"use client";

import { useState } from "react";
import Image from "next/image";
import { Home, Images } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ListingDetailImageGalleryProps } from "@/lib/types/listing-detail";

export function ListingDetailImageGallery({
  images,
}: ListingDetailImageGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const sorted = [...images].sort((a, b) => {
    if (a.is_cover) return -1;
    if (b.is_cover) return 1;
    return a.position - b.position;
  });

  const cover = sorted[0];
  const thumbnails = sorted.slice(1, 3);
  const hasMore = images.length > 3;
  const extraCount = images.length - 3;

  if (!images.length) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-xl bg-muted sm:h-80 lg:h-96">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Home className="h-12 w-12 opacity-20" />
          <span className="text-sm">No photos available</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid h-64 grid-cols-3 gap-2 overflow-hidden rounded-xl sm:h-80 lg:h-105">
        <div
          className="group relative col-span-2 cursor-pointer overflow-hidden"
          onClick={() => {
            setActiveIdx(0);
            setGalleryOpen(true);
          }}
        >
          <Image
            src={cover.public_url}
            alt="Main photo"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 66vw, (max-width: 1024px) 50vw, 660px"
            priority
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
        </div>

        <div className="flex flex-col gap-2">
          {thumbnails.map((img, idx) => (
            <div
              key={img.id}
              className="group relative flex-1 cursor-pointer overflow-hidden"
              onClick={() => {
                setActiveIdx(idx + 1);
                setGalleryOpen(true);
              }}
            >
              <Image
                src={img.public_url}
                alt={`Photo ${idx + 2}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 220px"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              {idx === 1 && hasMore && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveIdx(0);
                    setGalleryOpen(true);
                  }}
                >
                  <Images className="h-5 w-5 text-white" />
                  <span className="text-xs font-semibold text-white">
                    +{extraCount} more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="w-full max-w-4xl gap-0 overflow-hidden bg-background p-0">
          <DialogHeader className="border-b border-border px-4 py-3">
            <DialogTitle className="text-sm font-medium">
              {activeIdx + 1} / {sorted.length}
            </DialogTitle>
          </DialogHeader>
          <div className="relative h-[60vh] bg-black">
            <Image
              src={sorted[activeIdx].public_url}
              alt={`Photo ${activeIdx + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          {sorted.length > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-muted/30 p-3">
              {sorted.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded border-2 transition-all",
                    idx === activeIdx
                      ? "border-primary"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={img.public_url}
                    alt={`Thumb ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
