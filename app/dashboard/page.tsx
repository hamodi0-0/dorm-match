import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardHomeClient } from "@/components/dashboard/dashboard-home-client";
import type { StudentProfile } from "@/hooks/use-student-profile";
import type { Listing } from "@/lib/types/listing";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (user.user_metadata?.user_type !== "student") redirect("/");

  // Fetch profile + listings in parallel — both are initial page load data → Server Component
  const [profileResult, listingsResult] = await Promise.all([
    supabase.from("student_profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("listings")
      .select(
        `
        *,
        listing_images (
          id,
          listing_id,
          storage_path,
          public_url,
          position,
          is_cover,
          created_at
        )
      `,
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  if (!profileResult.data?.full_name) redirect("/onboarding");

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <DashboardHomeClient
        initialProfile={profileResult.data as StudentProfile}
        initialListings={(listingsResult.data ?? []) as Listing[]}
      />
    </>
  );
}
