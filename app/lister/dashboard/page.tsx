import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListerDashboardClient } from "@/components/lister/lister-dashboard-client";
import type { ListerProfile } from "@/hooks/use-lister-profile";

export default async function ListerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("lister_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  return <ListerDashboardClient initialProfile={profile as ListerProfile} />;
}
