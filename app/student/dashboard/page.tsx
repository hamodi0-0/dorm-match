import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHomeClient } from "@/components/student/dashboard-home-client";
import type { StudentProfile } from "@/hooks/use-student-profile";
import type {
  RecentConversation,
  TenantRequestItem,
} from "@/lib/types/student-dashboard";

function normaliseOne<T>(val: T | T[] | null): T | null {
  if (!val) return null;
  return Array.isArray(val) ? (val[0] ?? null) : val;
}

export default async function StudentHomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const userType = user.user_metadata?.user_type;
  if (userType !== "student") redirect("/lister/dashboard");

  const [profileResult, conversationsResult, requestsResult] =
    await Promise.all([
      supabase.from("student_profiles").select("*").eq("id", user.id).single(),

      supabase
        .from("conversations")
        .select("id, updated_at, listing_id, listings(title)")
        .eq("student_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(3),

      supabase
        .from("tenant_requests")
        .select("id, listing_id, status, updated_at, listings(title, city)")
        .eq("requester_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

  const profile = profileResult.data as StudentProfile | null;

  const recentConversations: RecentConversation[] = (
    conversationsResult.data ?? []
  ).map((c) => {
    const listing = normaliseOne(
      c.listings as { title: string } | { title: string }[] | null,
    );
    return {
      id: c.id,
      updated_at: c.updated_at,
      listing_id: c.listing_id,
      listing_title: listing?.title ?? "Unknown Listing",
    };
  });

  const tenantRequests: TenantRequestItem[] = (requestsResult.data ?? []).map(
    (r) => {
      const listing = normaliseOne(
        r.listings as
          | { title: string; city: string }
          | { title: string; city: string }[]
          | null,
      );
      return {
        id: r.id,
        listing_id: r.listing_id,
        listing_title: listing?.title ?? "Unknown Listing",
        listing_city: listing?.city ?? "",
        status: r.status as TenantRequestItem["status"],
        updated_at: r.updated_at,
      };
    },
  );

  return (
    <DashboardHomeClient
      initialProfile={profile}
      recentConversations={recentConversations}
      tenantRequests={tenantRequests}
    />
  );
}
