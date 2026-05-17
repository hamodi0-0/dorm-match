"use client";

import { Bell } from "lucide-react";
import type { EmptyStateProps } from "@/lib/types/notifications";

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
        <Bell className="h-6 w-6 text-muted-foreground" />
      </div>
      <div>
        <p className="font-medium text-foreground">No notifications yet</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">{message}</p>
      </div>
    </div>
  );
}
