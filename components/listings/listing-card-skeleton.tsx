import { Skeleton } from "@/components/ui/skeleton";

export default function ListingCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="w-full sm:w-72 lg:w-80 xl:w-88 shrink-0 h-52 sm:h-56" />
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3 min-w-0">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-5 w-3/4" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 shrink-0" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-4 pt-1 border-t border-border/50">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-muted/30">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
