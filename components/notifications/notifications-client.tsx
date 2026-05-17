"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import {
  useListerNotifications,
  useStudentNotifications,
  type StudentNotificationItem as StudentNotificationItemData,
} from "@/hooks/use-notifications";
import { markStudentNotificationsRead } from "@/app/actions/tenant-actions";
import { EmptyState } from "./empty-state";
import { ListerNotificationItem } from "./lister-notification-item";
import { StudentNotificationItem } from "./student-notification-item";
import type {
  ListerNotificationsClientProps,
  StudentNotificationsClientProps,
} from "@/lib/types/notifications";

export function ListerNotificationsClient({
  userId,
  initialData,
}: ListerNotificationsClientProps) {
  const { data: items = [] } = useListerNotifications(userId, initialData);

  const pendingItems = items.filter((i) => i.status === "pending");
  const resolvedItems = items.filter((i) => i.status !== "pending");

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-foreground">
          Notifications
        </h1>
        {pendingItems.length > 0 && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {pendingItems.length} pending request
            {pendingItems.length !== 1 ? "s" : ""} need your attention
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState message="You'll see tenant requests here when students want to be listed on your properties." />
      ) : (
        <div className="space-y-4">
          {pendingItems.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                Needs action ({pendingItems.length})
              </h2>
              <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                {pendingItems.map((item, i) => (
                  <div key={item.requestId}>
                    <ListerNotificationItem item={item} />
                    {i < pendingItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resolvedItems.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                Recent activity ({resolvedItems.length})
              </h2>
              <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                {resolvedItems.map((item, i) => (
                  <div key={item.requestId}>
                    <ListerNotificationItem item={item} />
                    {i < resolvedItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Student Notifications Client ─────────────────────────────────────────────

export function StudentNotificationsClient({
  userId,
  initialData,
}: StudentNotificationsClientProps) {
  const queryClient = useQueryClient();
  const { data: items = [] } = useStudentNotifications(userId, initialData);
  const hasMarkedRead = useRef(false);

  useEffect(() => {
    if (hasMarkedRead.current) return;

    const unreadIds = items
      .filter((i) => i.readAt === null)
      .map((i) => i.requestId);

    if (unreadIds.length === 0) return;

    hasMarkedRead.current = true;

    markStudentNotificationsRead(unreadIds).then(({ error }) => {
      if (error) {
        console.error("[markStudentNotificationsRead] failed:", error);
        return; // don't patch cache if DB write failed
      }
      queryClient.setQueryData<StudentNotificationItemData[]>(
        ["student-notifications", userId],
        (old) =>
          (old ?? []).map((item) =>
            unreadIds.includes(item.requestId)
              ? { ...item, readAt: new Date().toISOString() }
              : item,
          ),
      );
    });
  }, [items, userId, queryClient]);

  const acceptedItems = items.filter((i) => i.status === "accepted");
  const rejectedItems = items.filter((i) => i.status === "rejected");
  const removedItems = items.filter((i) => i.status === "removed");
  const unreadCount = items.filter((i) => i.readAt === null).length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-foreground">
          Notifications
        </h1>
        {items.length > 0 && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} notification{items.length !== 1 ? "s" : ""}
            {unreadCount > 0 && (
              <span className="text-primary font-medium">
                {" "}
                · {unreadCount} new
              </span>
            )}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState message="You'll be notified here when a lister accepts or declines your tenant request." />
      ) : (
        <div className="space-y-4">
          {removedItems.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                Removed ({removedItems.length})
              </h2>
              <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                {removedItems.map((item, i) => (
                  <div key={item.requestId}>
                    <StudentNotificationItem item={item} />
                    {i < removedItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {acceptedItems.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                Accepted ({acceptedItems.length})
              </h2>
              <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                {acceptedItems.map((item, i) => (
                  <div key={item.requestId}>
                    <StudentNotificationItem item={item} />
                    {i < acceptedItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {rejectedItems.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 px-1">
                Declined ({rejectedItems.length})
              </h2>
              <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                {rejectedItems.map((item, i) => (
                  <div key={item.requestId}>
                    <StudentNotificationItem item={item} />
                    {i < rejectedItems.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
