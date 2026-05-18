"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function ConversationRowSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 my-2 border-b border-border/50 rounded-xl">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-32 mb-1" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}
