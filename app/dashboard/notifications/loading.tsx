import { Skeleton } from "@/components/ui/skeleton";

function NotificationItemSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-4">
      {/* Status icon circle */}
      <Skeleton className="w-8 h-8 rounded-full shrink-0 mt-0.5" />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Title + badge */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        {/* City · time */}
        <Skeleton className="h-3 w-44" />
        {/* Status description */}
        <Skeleton className="h-3 w-64" />
      </div>

      {/* Arrow */}
      <Skeleton className="h-4 w-4 shrink-0 mt-1" />
    </div>
  );
}

function SectionSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div>
      {/* Section label e.g. "ACCEPTED (1)" */}
      <Skeleton className="h-3 w-28 mb-2 ml-1" />
      <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <NotificationItemSkeleton />
            {i < count - 1 && <div className="h-px bg-border" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationsLoading() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      {/* Title */}
      <div className="mb-6 space-y-1.5">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <SectionSkeleton count={1} />
        <SectionSkeleton count={2} />
      </div>
    </div>
  );
}
