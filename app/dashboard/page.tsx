import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHomeClient } from "@/components/dashboard/dashboard-home-client";

export default async function StudentHomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const userType = user.user_metadata?.user_type;
  if (userType !== "student") redirect("/lister/dashboard");

  // Notice: We don't await the profile query here anymore.
  // We just hand off the user ID to the client instantly.
  return <DashboardHomeClient userId={user.id} />;
}
