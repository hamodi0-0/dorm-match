import { Skeleton } from "@/components/ui/skeleton";
import { ListerDashboardHeader } from "@/components/lister/lister-dashboard-header";

export default function EditListingLoading() {
  return (
    <>
      <ListerDashboardHeader title="Edit Listing" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-3">
             <Skeleton className="h-5 w-32" />
             <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </main>
    </>
  );
}
