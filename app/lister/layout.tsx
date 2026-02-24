import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ListerSidebar } from "@/components/lister/lister-sidebar";
import { ListerLayoutClient } from "@/components/lister/lister-layout-client";

export default async function ListerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Auth guards — middleware handles the redirects but we double-check here
  if (!user) redirect("/");
  if (user.user_metadata?.user_type !== "lister") redirect("/");

  // Verify lister_profiles row exists
  const { data: profile } = await supabase
    .from("lister_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/lister/onboarding");

  return (
    <div className="min-h-screen bg-background flex">
      <ListerSidebar />
      <ListerLayoutClient>{children}</ListerLayoutClient>
    </div>
  );
}
