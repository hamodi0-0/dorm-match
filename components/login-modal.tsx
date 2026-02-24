"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

// ── Google SVG icon ──────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Student sign-in form ─────────────────────────────────────────────────────

function StudentSignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { loginSuccess, setShowSignup, setShowLogin } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user?.user_metadata?.user_type !== "student") {
        await supabase.auth.signOut();
        throw new Error("This account is not registered as a student");
      }

      const { data: profile } = await supabase
        .from("student_profiles")
        .select("profile_completed")
        .eq("id", data.user.id)
        .single();

      toast.success("Welcome back!");
      await loginSuccess();
      onSuccess();

      if (profile?.profile_completed) {
        router.push("/dashboard");
      } else {
        document
          .getElementById("how-it-works")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="student-email">University Email</Label>
        <Input
          id="student-email"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="student-password">Password</Label>
        <Input
          id="student-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          className="text-primary hover:underline font-medium"
          disabled={isLoading}
        >
          Sign up
        </button>
      </p>
    </form>
  );
}

// ── Lister Google sign-in ────────────────────────────────────────────────────

function ListerSignInPanel() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?user_type=lister`,
        },
      });
      if (error) throw error;
      // navigation handled by redirect — intentionally no setIsLoading(false)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start sign-in",
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
        <p className="text-sm font-medium text-foreground">
          Lister accounts use Google sign-in
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Whether you&apos;re a new or returning lister, continue with Google to
          create or resume your account.
        </p>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        variant="outline"
        size="lg"
        className="w-full gap-3"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        {isLoading ? "Redirecting…" : "Continue with Google"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Lister accounts are separate from student accounts.
      </p>
    </div>
  );
}

// ── Main modal ───────────────────────────────────────────────────────────────

export function LoginModal() {
  const showLogin = useAuthStore((s) => s.showLogin);
  const loginTab = useAuthStore((s) => s.loginTab);
  const setShowLogin = useAuthStore((s) => s.setShowLogin);

  const handleClose = (open: boolean) => {
    if (!open) setShowLogin(false);
  };

  return (
    <Dialog open={showLogin} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your Dormr account
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={loginTab}
          onValueChange={(v) => setShowLogin(true, v as "student" | "lister")}
          className="w-full"
        >
          <TabsList className="w-full mb-2">
            <TabsTrigger value="student" className="flex-1">
              Student
            </TabsTrigger>
            <TabsTrigger value="lister" className="flex-1">
              Lister
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student" className="mt-4">
            <StudentSignInForm onSuccess={() => setShowLogin(false)} />
          </TabsContent>

          <TabsContent value="lister" className="mt-4">
            <ListerSignInPanel />
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-muted-foreground px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
