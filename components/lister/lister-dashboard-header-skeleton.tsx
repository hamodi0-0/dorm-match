"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ListerDashboardHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      <Skeleton className="h-8 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-lg md:hidden" />
      </div>
    </div>
  );
}
