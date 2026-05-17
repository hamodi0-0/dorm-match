"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  UserPlus,
  GraduationCap,
  MessageSquare,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import {
  acceptTenantRequest,
  rejectTenantRequest,
} from "@/app/actions/tenant-actions";
import type { ListerNotificationItemProps } from "@/lib/types/notifications";

export function ListerNotificationItem({ item }: ListerNotificationItemProps) {
  const queryClient = useQueryClient();
  const [isAccepting, startAccept] = useTransition();
  const [isRejecting, startReject] = useTransition();
  const isPending = isAccepting || isRejecting;

  const initials = item.requesterName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAccept = () => {
    startAccept(async () => {
      const result = await acceptTenantRequest(item.requestId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${item.requesterName} added as tenant`);
        queryClient.invalidateQueries({ queryKey: ["lister-notifications"] });
      }
    });
  };

  const handleReject = () => {
    startReject(async () => {
      const result = await rejectTenantRequest(item.requestId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Request declined");
        queryClient.invalidateQueries({ queryKey: ["lister-notifications"] });
      }
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start gap-4 px-4 py-4",
        item.status === "pending" && "bg-primary/5 dark:bg-primary/10",
      )}
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="mt-0.5 shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <UserPlus className="h-4 w-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage
                src={item.requesterAvatar ?? undefined}
                className="object-cover"
              />
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-foreground">
              {item.requesterName}
            </span>
            <StatusBadge status={item.status} />
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
            <GraduationCap className="h-3 w-3 shrink-0" />
            <span>
              {item.requesterMajor} · {item.requesterUniversity}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Wants to be a tenant on{" "}
            <Link
              href={`/lister/listings/${item.listingId}/tenants`}
              className="font-medium text-primary hover:underline"
            >
              {item.listingTitle}
            </Link>{" "}
            ·{" "}
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </p>

          {item.message && (
            <div className="flex items-start gap-2 mt-2 rounded-md bg-muted/50 border border-border/50 px-3 py-2">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                &ldquo;{item.message}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {item.status === "pending" && (
        <div className="flex items-center gap-2 shrink-0 sm:mt-0.5">
          <Button
            size="sm"
            className="h-8 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white"
            onClick={handleAccept}
            disabled={isPending}
          >
            {isAccepting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3 w-3" />
            )}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={handleReject}
            disabled={isPending}
          >
            {isRejecting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
