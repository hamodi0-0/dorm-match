"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, CheckCircle2, XCircle, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import type { StudentNotificationItemProps } from "@/lib/types/notifications";

export function StudentNotificationItem({
  item,
}: StudentNotificationItemProps) {
  const isAccepted = item.status === "accepted";
  const isRemoved = item.status === "removed";
  const isUnread = item.readAt === null;

  return (
    <Link
      href={`/student/listings/${item.listingId}`}
      className="flex items-start gap-3 px-4 py-4 hover:bg-accent/50 transition-colors group relative"
    >
      {isUnread && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      )}

      <div
        className={cn(
          "mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isAccepted
            ? "bg-emerald-100 dark:bg-emerald-950/40"
            : isRemoved
              ? "bg-orange-100 dark:bg-orange-950/40"
              : "bg-muted",
        )}
      >
        {isAccepted ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        ) : isRemoved ? (
          <UserMinus className="h-4 w-4 text-orange-600 dark:text-orange-400" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p
            className={cn(
              "text-sm text-foreground",
              isUnread ? "font-semibold" : "font-medium",
            )}
          >
            {item.listingTitle}
          </p>
          <StatusBadge status={item.status} />
        </div>

        <p className="text-xs text-muted-foreground">
          {item.listingCity} ·{" "}
          {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
        </p>

        <p
          className={cn(
            "text-xs mt-0.5",
            isAccepted
              ? "text-emerald-600 dark:text-emerald-400"
              : isRemoved
                ? "text-orange-600 dark:text-orange-400"
                : "text-muted-foreground",
          )}
        >
          {isAccepted
            ? "You've been confirmed as a tenant on this listing."
            : isRemoved
              ? "You've been removed from this listing by the lister."
              : "Your request was declined by the lister."}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
