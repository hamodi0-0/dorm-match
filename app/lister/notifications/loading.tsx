import { Skeleton } from "@/components/ui/skeleton";
import { ListerDashboardHeader } from "@/components/lister/lister-dashboard-header";

function NotificationItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 px-4 py-4">
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full">
        {/* Status icon circle */}
        <Skeleton className="w-8 h-8 rounded-full shrink-0 mt-0.5" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Avatar + Title + badge */}
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <Skeleton className="h-4 w-24 sm:w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          
          {/* Major · university */}
          <div className="mb-1.5">
            <Skeleton className="h-3 w-10/12 max-w-[200px]" />
          </div>
          
          {/* Wants to be a tenant... */}
          <div className="mb-2">
            <Skeleton className="h-3 w-full max-w-[280px]" />
          </div>

          {/* Optional message box skeleton */}
          <Skeleton className="mt-2 h-12 w-full rounded-md" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 sm:mt-0.5">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

function SectionSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div>
      {/* Section label e.g. "REQUESTS (1)" */}
      <Skeleton className="h-3 w-24 mb-2 ml-1" />
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
    <>
      <ListerDashboardHeader title="Notifications" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          <SectionSkeleton count={2} />
          <SectionSkeleton count={1} />
        </div>
      </main>
    </>
  );
}
