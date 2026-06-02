// app/onboarding/layout.tsx  (new file)
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (user.user_metadata?.user_type !== "student") redirect("/");

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("profile_completed")
    .eq("id", user.id)
    .single();

  // Already onboarded — skip to dashboard
  if (profile?.profile_completed) {
    redirect("/student/dashboard");
  }

  return <>{children}</>;
}
