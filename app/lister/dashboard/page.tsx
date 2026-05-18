import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListerDashboardHeader } from "@/components/lister/lister-dashboard-header";
import type { ListerProfile } from "@/hooks/use-lister-profile";
import { ListerDashboardClient } from "@/components/lister/lister-dashboard-client";
import type {
  DashboardListing,
  DashboardTenant,
  DashboardTenantProfile,
  PendingRequest,
  MonthlyDataPoint,
  RevenueDataPoint,
} from "@/lib/types/dashboard";

const CHART_MONTHS = 6;

function buildMonthlyData(
  listings: DashboardListing[],
  tenants: DashboardTenant[],
): MonthlyDataPoint[] {
  const now = new Date();
  return Array.from({ length: CHART_MONTHS }, (_, i) => {
    const start = new Date(
      now.getFullYear(),
      now.getMonth() - (CHART_MONTHS - 1 - i),
      1,
    );
    const end = new Date(
      now.getFullYear(),
      now.getMonth() - (CHART_MONTHS - 1 - i) + 1,
      1,
    );
    const label = start.toLocaleDateString("en-US", { month: "short" });

    return {
      month: label,
      listings: listings.filter((l) => {
        const d = new Date(l.created_at);
        return d >= start && d < end;
      }).length,
      tenants: tenants.filter((t) => {
        const d = new Date(t.added_at);
        return d >= start && d < end;
      }).length,
    };
  });
}

export default async function ListerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [profileResult, listingsResult] = await Promise.all([
    supabase.from("lister_profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("listings")
      .select("id, status, title, created_at, city, price_per_month")
      .eq("lister_id", user.id)
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
  ]);

  const profile = profileResult.data as ListerProfile | null;
  if (!profile) redirect("/");

  const listings = (listingsResult.data ?? []) as DashboardListing[];
  const listingIds = listings.map((l) => l.id);
  const listingMap = new Map(listings.map((l) => [l.id, l]));

  const [tenantsResult, requestsResult] =
    listingIds.length > 0
      ? await Promise.all([
          supabase
            .from("listing_tenants")
            .select("id, added_at, user_id, listing_id")
            .in("listing_id", listingIds)
            .order("added_at", { ascending: false }),

          supabase
            .from("tenant_requests")
            .select("id, requester_id, listing_id, message, created_at")
            .in("listing_id", listingIds)
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .limit(5),
        ])
      : [{ data: [] }, { data: [] }];

  // Batch-fetch student profiles for tenants and pending requests
  const profileIdsToFetch = [
    ...new Set([
      ...(tenantsResult.data ?? []).map((t) => t.user_id),
      ...(requestsResult.data ?? []).map((r) => r.requester_id),
    ]),
  ];
  const { data: fetchedProfiles } =
    profileIdsToFetch.length > 0
      ? await supabase
          .from("student_profiles")
          .select("id, full_name, avatar_url, university_name, major")
          .in("id", profileIdsToFetch)
      : { data: [] };

  console.log("Fetched profiles:", fetchedProfiles);

  console.log("Tenants Result Data:", tenantsResult.data);
  console.log("Requests Result Data:", requestsResult.data);

  const profileMap = new Map((fetchedProfiles ?? []).map((p) => [p.id, p]));

  const tenants: DashboardTenant[] = (tenantsResult.data ?? [])
    .map((row) => {
      const sp = profileMap.get(row.user_id);
      const listing = listingMap.get(row.listing_id);
      return {
        id: row.id,
        added_at: row.added_at,
        user_id: row.user_id,
        listing_id: row.listing_id,
        listing: listing ? { title: listing.title, city: listing.city } : null,
        student_profiles: (sp as DashboardTenantProfile) ?? null,
      };
    })
    .filter((t) => t.student_profiles !== null);

  const pendingRequests: PendingRequest[] = (requestsResult.data ?? []).map(
    (row) => {
      const listing = listingMap.get(row.listing_id);
      const profile = profileMap.get(row.requester_id) ?? null;
      return {
        id: row.id,
        requester_id: row.requester_id,
        listing_id: row.listing_id,
        listing_title: listing?.title ?? "Unknown Listing",
        message: row.message ?? null,
        created_at: row.created_at,
        student_profiles: (profile as DashboardTenantProfile) ?? null,
      };
    },
  );

  // Chart data — derived from already-fetched DB results, no extra queries
  const monthlyData: MonthlyDataPoint[] = buildMonthlyData(listings, tenants);

  const revenueData: RevenueDataPoint[] = listings
    .filter((l) => l.status === "active")
    .map((l) => ({
      name: l.title.length > 20 ? l.title.slice(0, 20) + "…" : l.title,
      revenue: l.price_per_month,
    }));

  return (
    <>
      <ListerDashboardHeader title="Dashboard" />
      <ListerDashboardClient
        profile={profile}
        listings={listings}
        tenants={tenants}
        pendingRequests={pendingRequests}
        monthlyData={monthlyData}
        revenueData={revenueData}
      />
    </>
  );
}
