import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardHomeClient } from "@/components/dashboard/dashboard-home-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (user.user_metadata?.user_type !== "student") redirect("/");

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("full_name, university_name, major, year_of_study, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile?.full_name) redirect("/onboarding");

  return (
    <>
      <DashboardHeader title="Home" />
      <DashboardHomeClient profile={profile} />
    </>
  );
}
