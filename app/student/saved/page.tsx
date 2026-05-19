import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SavedPageClient } from "@/components/student/saved-page-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved Listings | Dormr",
  description: "View your saved listings",
};

export default async function SavedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const userType = user.user_metadata?.user_type;
  if (userType !== "student") redirect("/lister/dashboard");

  return <SavedPageClient />;
}
