import { Skeleton } from "@/components/ui/skeleton";
import type { ListingsBrowseSkeletonProps } from "@/lib/types/listings-browse";

export function ListingsBrowseSkeleton({
  count = 10,
}: ListingsBrowseSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card overflow-hidden flex h-42.5"
        >
          <Skeleton className="w-60 shrink-0 h-full" />
          <div className="flex-1 p-4 space-y-3">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
            <div className="flex gap-4 pt-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
