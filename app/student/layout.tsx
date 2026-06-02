// app/student/layout.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StudentNavHeader } from "@/components/student/student-nav-header";
import { Footer } from "@/components/footer";

export default async function StudentLayout({
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

  // Profile completion check lives here — runs once when a student
  // navigates into /student/*, not on every single request across the app.
  const { data: profile } = await supabase
    .from("student_profiles")
    .select("profile_completed")
    .eq("id", user.id)
    .single();

  if (!profile?.profile_completed) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StudentNavHeader />
      <div className="flex-1 flex flex-col min-h-[calc(100vh-64px)]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
