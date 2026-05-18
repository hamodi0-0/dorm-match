import { Skeleton } from "@/components/ui/skeleton";

export default function MyListingsLoading() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col space-y-3 rounded-xl border border-border overflow-hidden"
          >
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="p-4 border-t border-border flex justify-between gap-2 bg-muted/20">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-10 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
