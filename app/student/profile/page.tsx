import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfilePageClient } from "@/components/student/profile-page-client";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const userType = user.user_metadata?.user_type;
  if (userType !== "student") redirect("/lister/dashboard");

  return <ProfilePageClient userEmail={user.email ?? ""} />;
}
