import { Skeleton } from "@/components/ui/skeleton";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2 h-64 sm:h-80 lg:h-[420px] rounded-xl overflow-hidden mb-6">
      {/* Cover image — col-span-2 */}
      <Skeleton className="col-span-2 h-full rounded-none" />
      {/* Two stacked thumbnails */}
      <div className="flex flex-col gap-2">
        <Skeleton className="flex-1 rounded-none" />
        <Skeleton className="flex-1 rounded-none" />
      </div>
    </div>
  );
}

function StatBadgeSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="w-7 h-7 rounded-md shrink-0" />
      <div className="space-y-1.5">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export default function ListingDetailLoading() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Back link */}
      <Skeleton className="h-4 w-28 mb-5" />

      {/* Image gallery */}
      <GallerySkeleton />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 xl:gap-8">
        {/* ── Left column ── */}
        <div className="space-y-5 min-w-0">
          {/* Price + stat badges */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Skeleton className="h-10 w-44" />
            <div className="flex flex-wrap gap-4">
              <StatBadgeSkeleton />
              <StatBadgeSkeleton />
              <StatBadgeSkeleton />
            </div>
          </div>

          {/* Room type label + title + address */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-52" />
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-1.5 mt-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          {/* About this listing */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* Property details card */}
          <div className="rounded-xl border bg-card py-0 overflow-hidden">
            <div className="pt-5 pb-0 px-5">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="pt-4 pb-5 px-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 sm:py-2.5"
                  >
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities card */}
          <div className="rounded-xl border bg-card py-0 overflow-hidden">
            <div className="pt-5 pb-0 px-5">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="pt-4 pb-5 px-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg border border-border/40"
                  >
                    <Skeleton className="w-7 h-7 rounded-md shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4">
          {/* Price + action buttons card */}
          <div className="rounded-xl border bg-card py-0">
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Skeleton className="h-8 w-36" />
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-5 w-28 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-2.5">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div className="space-y-2 pt-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verified listing card */}
          <div className="rounded-xl border bg-card py-0">
            <div className="p-4">
              <div className="flex items-start gap-2.5">
                <Skeleton className="h-4 w-4 rounded-full shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
