"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeaderSkeleton() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center px-4 gap-3">
      <Skeleton className="h-9 w-9 rounded-lg" />
      <Skeleton className="h-5 w-28" />
    </header>
  );
}
