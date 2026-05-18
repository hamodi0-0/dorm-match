import { Skeleton } from "@/components/ui/skeleton";
import { ListerDashboardHeader } from "@/components/lister/lister-dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PoundSterling, UsersRound } from "lucide-react";

function StatCardSkeleton() {
  return (
    <Card className="py-0 border border-border shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3">
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

function TenantRowSkeleton() {
  return (
    <tr className="border-b border-border text-left last:border-0 hover:bg-muted/30">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 hidden sm:table-cell">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>
      </td>
      <td className="px-4 py-3.5 hidden lg:table-cell">
        <Skeleton className="h-4 w-36" />
      </td>
      <td className="px-4 py-3.5 hidden xl:table-cell">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-5 py-3.5 text-right w-[60px]">
        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
      </td>
    </tr>
  );
}

export default function DashboardLoading() {
  return (
    <>
      <ListerDashboardHeader title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2.5">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="self-start sm:self-auto">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        <Card className="py-0 border-primary/20 bg-primary/5 dark:bg-primary/10">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <PoundSterling className="h-5 w-5 text-primary" />
               </div>
               <div className="space-y-1.5">
                 <Skeleton className="h-3 w-32" />
                 <Skeleton className="h-7 w-28" />
               </div>
             </div>
             <Skeleton className="h-3 w-40" />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="lg:col-span-3 py-0">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex justify-between items-center">
                 <div className="space-y-1.5">
                   <Skeleton className="h-4 w-32" />
                   <Skeleton className="h-3 w-48" />
                 </div>
                 <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="px-2 pb-4">
              <Skeleton className="h-[250px] w-full mt-4" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 py-0">
            <CardHeader className="px-5 pt-5 pb-3">
               <div className="space-y-1.5">
                 <Skeleton className="h-4 w-36" />
                 <Skeleton className="h-3 w-40" />
               </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-[250px] w-full mt-8" />
            </CardContent>
          </Card>
        </div>

        <Card className="py-0">
          <CardHeader className="px-5 pt-5 pb-3 border-b border-border">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                   <UsersRound className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1.5">
                   <Skeleton className="h-4 w-24" />
                   <Skeleton className="h-3 w-48" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead>
                   <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted/20">
                     <th className="px-5 py-3 font-medium">Tenant</th>
                     <th className="px-4 py-3 font-medium hidden sm:table-cell">Listing</th>
                     <th className="px-4 py-3 font-medium hidden lg:table-cell">University</th>
                     <th className="px-4 py-3 font-medium hidden xl:table-cell">Added</th>
                     <th className="px-5 py-3 text-right"></th>
                   </tr>
                 </thead>
                 <tbody>
                    {Array.from({ length: 2 }).map((_, i) => (
                      <TenantRowSkeleton key={i} />
                    ))}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
