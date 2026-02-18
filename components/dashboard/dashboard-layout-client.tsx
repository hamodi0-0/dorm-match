"use client";

import { useSidebar } from "@/components/dashboard/sidebar-context";
import { cn } from "@/lib/utils";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        isOpen ? "ml-64" : "ml-16",
      )}
    >
      {children}
    </div>
  );
}
