import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border p-5 space-y-3">
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

function TenantRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 last:border-0">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-28 hidden sm:block" />
      <Skeleton className="h-4 w-16 hidden md:block" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <TenantRowSkeleton key={i} />
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border p-5 flex items-center gap-4"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
      </div>
    </main>
  );
}
