import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Building2, Home, ArrowRight, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TenantRequestItem, RequestStatus } from "@/lib/types/student-dashboard";

export const STATUS_CONFIG: Record<RequestStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  },
  accepted: {
    label: "Accepted 🎉",
    className: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  rejected: {
    label: "Not accepted",
    className: "border-border bg-muted/50 text-muted-foreground",
  },
  removed: {
    label: "Removed",
    className: "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
  },
};

export function DashboardApplications({ requests }: { requests: TenantRequestItem[] }) {
  return (
    <Card className="lg:col-span-2 py-0">
      <CardHeader className="px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 className="h-3.5 w-3.5 text-primary" />
            </div>
            My Applications
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-xs h-7 gap-1 shrink-0">
            <Link href="/dashboard/notifications">
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
            <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
              <Home className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No applications yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Find a listing and request to join as a tenant.</p>
            </div>
            <Button asChild size="sm" className="gap-1.5 mt-1">
              <Link href="/dashboard/listings">
                Browse Listings
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        ) : (
          requests.map((req, i) => {
            const config = STATUS_CONFIG[req.status];
            const timeAgo = formatDistanceToNow(new Date(req.updated_at), { addSuffix: true });
            return (
              <Link
                key={req.id}
                href={`/dashboard/listings/${req.listing_id}`}
                className={cn(
                  "flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors",
                  i < requests.length - 1 && "border-b border-border/50"
                )}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Home className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{req.listing_title}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Clock className="h-3 w-3 shrink-0" />
                    <span>{timeAgo}</span>
                    {req.listing_city && (
                      <>
                        <span>·</span>
                        <span>{req.listing_city}</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-xs shrink-0", config.className)}>
                  {config.label}
                </Badge>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
