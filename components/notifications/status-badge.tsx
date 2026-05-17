"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, UserMinus } from "lucide-react";
import type { StatusBadgeProps } from "@/lib/types/notifications";

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "pending")
    return (
      <Badge
        variant="outline"
        className="border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300 text-xs gap-1"
      >
        Pending
      </Badge>
    );
  if (status === "accepted")
    return (
      <Badge
        variant="outline"
        className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 text-xs gap-1"
      >
        <CheckCircle2 className="h-2.5 w-2.5" />
        Accepted
      </Badge>
    );
  if (status === "removed")
    return (
      <Badge
        variant="outline"
        className="border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-300 text-xs gap-1"
      >
        <UserMinus className="h-2.5 w-2.5" />
        Removed
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="border-border bg-muted/50 text-muted-foreground text-xs gap-1"
    >
      <XCircle className="h-2.5 w-2.5" />
      Declined
    </Badge>
  );
}
