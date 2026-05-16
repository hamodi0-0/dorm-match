import { Skeleton } from "@/components/ui/skeleton";
import type { ListingsBrowseSkeletonProps } from "@/lib/types/listings-browse";

function ListingCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden my-2 shadow-sm flex flex-col">
      {/* Body: mirrors the flex flex-col sm:flex-row layout of ListingCard */}
      <div className="flex flex-col sm:flex-row">
        {/* Image — matches sm:w-72 lg:w-80 xl:w-88, h-52 sm:h-56 */}
        <Skeleton className="w-full sm:w-72 lg:w-80 xl:w-88 shrink-0 h-52 sm:h-56" />

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3 min-w-0">
          {/* Room type label */}
          <Skeleton className="h-3 w-20" />

          {/* Price */}
          <Skeleton className="h-8 w-28" />

          {/* Title */}
          <Skeleton className="h-5 w-3/4" />

          {/* Location */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 shrink-0" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Stats row — mirrors the border-t section */}
          <div className="flex items-center gap-4 pt-1 border-t border-border/50">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Footer — mirrors the border-t footer with listed time + action buttons */}
      <div className="border-t border-border/60 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-muted/30">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ListingsBrowseSkeleton({
  count = 5,
}: ListingsBrowseSkeletonProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
