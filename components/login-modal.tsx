"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export function LoginModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const showLogin = useAuthStore((s) => s.showLogin);
  const setShowLogin = useAuthStore((s) => s.setShowLogin);
  const setShowSignup = useAuthStore((s) => s.setShowSignup);
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const handleEmailLogin = async (e: React.FormEvent) => {
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

      // Check if user is a student
      if (data.user?.user_metadata?.user_type !== "student") {
        await supabase.auth.signOut();
        throw new Error("This account is not registered as a student");
      }

      // Check if profile is completed
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("profile_completed")
        .eq("id", data.user.id)
        .single();

      toast.success("Welcome back!");
      // update store and close modal
      await loginSuccess();

      // Redirect based on profile completion
      if (profile?.profile_completed) {
        router.push("/dashboard");
      } else {
        document
          .getElementById("how-it-works")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showLogin} onOpenChange={setShowLogin}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your student account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEmailLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">University Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
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
        </div>

        <p className="text-center text-xs text-muted-foreground px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
