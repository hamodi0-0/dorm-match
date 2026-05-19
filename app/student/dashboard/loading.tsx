import { Skeleton } from "@/components/ui/skeleton";

function HeroSkeleton() {
  return (
    <div className="relative rounded-2xl bg-primary/5 border border-primary/20 p-6 sm:p-8 overflow-hidden">
      <Skeleton className="h-3 w-28 mb-3" />
      <Skeleton className="h-9 w-64 mb-2" />
      <Skeleton className="h-4 w-56 mb-6" />
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}

function ActivityRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 last:border-0">
      <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full shrink-0" />
    </div>
  );
}

function ChatRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50 last:border-0">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-4 shrink-0" />
    </div>
  );
}

function CardHeaderSkeleton() {
  return (
    <div className="px-5 py-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-6 w-14 rounded-md" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-5">
      <HeroSkeleton />

      {/* Activity grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Applications card */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <CardHeaderSkeleton />
          <ActivityRowSkeleton />
          <ActivityRowSkeleton />
          <ActivityRowSkeleton />
        </div>

        {/* Chats card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <CardHeaderSkeleton />
          <ChatRowSkeleton />
          <ChatRowSkeleton />
        </div>
      </div>

      {/* Profile completion */}
      <div className="rounded-xl border border-primary/20 bg-card p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-52" />
            </div>
          </div>
          <Skeleton className="h-5 w-10 shrink-0" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-28 rounded-full" />
          ))}
        </div>
      </div>
    </main>
  );
}
