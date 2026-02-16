// app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/"); // Not logged in
  }

  if (user.user_metadata?.user_type !== "student") {
    redirect("/"); // Not a student
  }

  return (
    <div>
      <h1>Welcome, {user.user_metadata?.full_name}!</h1>
      <p>Email: {user.email}</p>
      <LogoutButton />
    </div>
  );
}
