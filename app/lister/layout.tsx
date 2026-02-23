import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ListerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");
  if (user.user_metadata?.user_type !== "lister") redirect("/");

  // Verify lister_profiles row exists (created by callback)
  const { data: profile } = await supabase
    .from("lister_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  return <>{children}</>;
}
