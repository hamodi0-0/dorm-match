export interface RecentConversation {
  id: string;
  updated_at: string;
  listing_id: string;
  listing_title: string;
}

export type RequestStatus = "pending" | "accepted" | "rejected" | "removed";

export interface TenantRequestItem {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_city: string;
  status: RequestStatus;
  updated_at: string;
}
