"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ConversationRowSkeleton } from "./conversation-row-skeleton";

export function ChatViewSkeleton() {
  return (
    <div
      className="flex w-full overflow-hidden bg-background border-y sm:border sm:rounded-xl sm:my-6 sm:mx-auto sm:max-w-6xl shadow-sm"
      style={{
        height: "calc(100vh - 100px)",
        minHeight: "500px",
        maxHeight: "800px",
      }}
    >
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border shrink-0">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <ConversationRowSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl" />
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
