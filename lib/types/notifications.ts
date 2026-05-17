export interface NotificationBellProps {
  href: string;
  count?: number;
  className?: string;
}

import type { TenantRequestStatus } from "@/lib/types/listing";
import type {
  ListerNotificationItem,
  StudentNotificationItem,
} from "@/hooks/use-notifications";

export interface StatusBadgeProps {
  status: TenantRequestStatus;
}

export interface EmptyStateProps {
  message: string;
}

export interface ListerNotificationItemProps {
  item: ListerNotificationItem;
}

export interface StudentNotificationItemProps {
  item: StudentNotificationItem;
}

export interface ListerNotificationsClientProps {
  userId: string;
  initialData: ListerNotificationItem[];
}

export interface StudentNotificationsClientProps {
  userId: string;
  initialData: StudentNotificationItem[];
}
