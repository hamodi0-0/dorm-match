"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ConversationRowSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-border/50">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}
