"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, LogOut, Plus, Sparkles } from "lucide-react";
import {
  useListerProfile,
  type ListerProfile,
} from "@/hooks/use-lister-profile";

interface ListerDashboardClientProps {
  initialProfile: ListerProfile;
}

const COMING_SOON = [
  { label: "Create a Listing", icon: Plus },
  { label: "View Your Listings", icon: Building2 },
  { label: "Chat with Students", icon: Sparkles },
];

export function ListerDashboardClient({
  initialProfile,
}: ListerDashboardClientProps) {
  const router = useRouter();
  const { data: profile } = useListerProfile(initialProfile);

  const firstName = profile!.full_name.split(" ")[0];

  const initials = profile!.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    const supabase = createClient();
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-serif font-medium">Dormr</span>
          <span className="hidden sm:inline text-muted-foreground text-sm">
            / Lister
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <Avatar className="h-7 w-7">
              <AvatarImage
                src={profile!.avatar_url ?? undefined}
                className="object-cover"
              />
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">
              {profile!.full_name}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-6">
          {/* Welcome card */}
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={profile!.avatar_url ?? undefined}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary font-medium font-serif">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-serif">
                Welcome, {firstName}! 🏠
              </CardTitle>
              <CardDescription>
                Your lister dashboard is ready. Listings and management tools
                are coming soon.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Coming next in Phase 3
                  </span>
                </div>
                <ul className="space-y-2">
                  {COMING_SOON.map(({ label, icon: Icon }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Signed in as{" "}
                <span className="font-medium text-foreground">
                  {profile!.email}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
