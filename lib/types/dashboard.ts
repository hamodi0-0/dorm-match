export interface DashboardListing {
  id: string;
  status: string;
  title: string;
  created_at: string;
  city: string;
  price_per_month: number;
}

export interface DashboardTenantProfile {
  full_name: string;
  avatar_url: string | null;
  university_name: string;
  major: string;
}

export interface DashboardTenant {
  id: string;
  added_at: string;
  user_id: string;
  listing_id: string;
  listing: { title: string; city: string } | null;
  student_profiles: DashboardTenantProfile | null;
}

export interface PendingRequest {
  id: string;
  requester_id: string;
  listing_id: string;
  listing_title: string;
  message: string | null;
  created_at: string;
  student_profiles: DashboardTenantProfile | null;
}

export interface MonthlyDataPoint {
  month: string;
  listings: number;
  tenants: number;
}

export interface RevenueDataPoint {
  name: string;
  revenue: number;
}
