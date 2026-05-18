import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListerDashboardHeader } from "@/components/lister/lister-dashboard-header";

export default function ListingTenantsLoading() {
  return (
    <>
      <ListerDashboardHeader title="Manage Tenants" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6">
        <div className="flex items-center text-sm font-medium text-muted-foreground opacity-60">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listing
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        <Card className="py-0 border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground/50" />
              <Skeleton className="h-4 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-border/60 last:border-0 border-dashed">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <div className="flex items-center gap-6">
                   <Skeleton className="h-3 w-28 shrink-0 hidden sm:block" />
                   <Skeleton className="h-4 w-4 shrink-0" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
