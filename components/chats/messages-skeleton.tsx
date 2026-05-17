"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MessagesSkeleton() {
  return (
    <div className="flex-1 overflow-hidden p-4 flex flex-col gap-4">
      <div className="self-end flex flex-col items-end gap-1">
        <Skeleton className="h-9 w-24 rounded-2xl rounded-br-sm" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="self-start flex flex-col items-start gap-1">
        <Skeleton className="h-9 w-40 rounded-2xl rounded-bl-sm" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="self-end flex flex-col items-end gap-1">
        <Skeleton className="h-9 w-32 rounded-2xl rounded-br-sm" />
        <Skeleton className="h-3 w-12" />
      </div>
      <div className="self-start flex flex-col items-start gap-1">
        <Skeleton className="h-9 w-48 rounded-2xl rounded-bl-sm" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
