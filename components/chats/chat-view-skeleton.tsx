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
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 pb-7 border-b border-border shrink-0">
          <Skeleton className="h-6 w-24" />
        </div>
        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto pb-2 px-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ConversationRowSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Main Area (Messages) */}
      <div className="hidden md:flex flex-1 flex-col h-full min-h-0 bg-background relative">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-background shrink-0 z-10">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 min-w-0 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        {/* Messages Container */}
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

        {/* Input area */}
        <div className="p-4 border-t border-border flex gap-2 shrink-0">
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
