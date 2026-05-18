"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function MessagesSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
      <div className="flex flex-col max-w-[80%] self-end items-end">
        <Skeleton className="h-9 w-24 rounded-2xl rounded-br-sm" />
        <Skeleton className="h-3 w-12 mt-1 mx-1 px-1" />
      </div>
      <div className="flex flex-col max-w-[80%] self-start items-start">
        <Skeleton className="h-9 w-40 rounded-2xl rounded-bl-sm" />
        <Skeleton className="h-3 w-12 mt-1 mx-1 px-1" />
      </div>
      <div className="flex flex-col max-w-[80%] self-end items-end">
        <Skeleton className="h-9 w-32 rounded-2xl rounded-br-sm" />
        <Skeleton className="h-3 w-12 mt-1 mx-1 px-1" />
      </div>
      <div className="flex flex-col max-w-[80%] self-start items-start">
        <Skeleton className="h-9 w-48 rounded-2xl rounded-bl-sm" />
        <Skeleton className="h-3 w-12 mt-1 mx-1 px-1" />
      </div>
    </div>
  );
}
