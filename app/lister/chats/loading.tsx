import { Skeleton } from "@/components/ui/skeleton";

function ConversationRowSkeleton() {
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

export default function ChatsLoading() {
  return (
    <div
      className="flex w-full overflow-hidden bg-background border-y sm:border sm:rounded-xl sm:my-6 sm:mx-auto sm:max-w-6xl shadow-sm"
      style={{
        height: "calc(100vh - 60px)",
        minHeight: "500px",
        maxHeight: "800px",
      }}
    >
      {/* Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border shrink-0">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <ConversationRowSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Right panel (desktop only) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl" />
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
