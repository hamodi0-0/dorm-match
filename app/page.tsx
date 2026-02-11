import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-gray-900">Dorm Match</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find compatible roommates for university housing. Connect with
          students who match your lifestyle.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          {user ? (
            // Logged in - show dashboard link and logout
            <>
              <Link href="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            // Not logged in - show get started button
            <Link href="/auth/login">
              <Button size="lg">Get Started</Button>
            </Link>
          )}
        </div>

        {user && (
          <p className="text-sm text-gray-500 mt-4">
            Logged in as {user.email}
          </p>
        )}
      </div>
    </main>
  );
}
