import type { Listing } from "@/lib/types/listing";
import { PREFETCH_WIDTHS } from "@/lib/constants";

export function getCoverUrl(listing: Listing): string | null {
  const images = listing.listing_images;
  if (!images?.length) return null;
  return (images.find((img) => img.is_cover) ?? images[0])?.public_url ?? null;
}

export function prefetchCoverImages(listings: Listing[]): void {
  listings.slice(0, 6).forEach((listing) => {
    const url = getCoverUrl(listing);
    if (!url) return;

    PREFETCH_WIDTHS.forEach((w) => {
      const href = `/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`;
      if (document.head.querySelector(`link[href="${CSS.escape(href)}"]`))
        return;

      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
    });
  });
}
