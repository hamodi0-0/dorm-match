import { Skeleton } from "@/components/ui/skeleton";
import { ListingsBrowseSkeleton } from "@/components/listings/listings-browse-skeleton";

export default function BrowseListingsLoading() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Filter bar — matches ListingsFilterBar dimensions */}
      <div className="sticky top-0 z-20 bg-background/97 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <div className="w-px h-6 bg-border shrink-0" />
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
          {/* Mobile */}
          <div className="flex flex-col gap-2 md:hidden">
            <Skeleton className="h-10 w-full rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-28 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Page title */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-1 w-full">
        <Skeleton className="h-8 w-44 mb-2" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Listing cards */}
      <main className="flex-1 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full">
        <Skeleton className="h-3 w-16 mb-4" />
        <ListingsBrowseSkeleton count={5} />
      </main>
    </div>
  );
}
