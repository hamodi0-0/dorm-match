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
import { useAuthStore } from "@/lib/stores/auth-store";

export function SignupModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const showSignup = useAuthStore((s) => s.showSignup);
  const setShowSignup = useAuthStore((s) => s.setShowSignup);
  const setShowLogin = useAuthStore((s) => s.setShowLogin);
  const signupSuccess = useAuthStore((s) => s.signupSuccess);

  const validateEmailDomain = async (email: string): Promise<boolean> => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase.rpc("is_email_domain_allowed", {
        email_address: email,
      });

      if (error) {
        console.error("Domain validation error:", error);
        return false;
      }

      return data === true;
    } catch (error) {
      console.error("Domain validation failed:", error);
      return false;
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Validate email domain first
      const isDomainAllowed = await validateEmailDomain(formData.email);

      if (!isDomainAllowed) {
        throw new Error("Please use a valid university email address.");
      }

      const supabase = createClient();

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: "student",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        console.log(data);
        toast.success(
          "Account created! Please check your university email to verify your account.",
          {
            duration: 6000,
          },
        );
      } else {
        toast.success("Account created successfully!");
      }

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      // update store and close modal
      await signupSuccess();

      // keep toast visible then scroll to how-it-works for next step
      document
        .getElementById("how-it-works")
        ?.scrollIntoView({ behavior: "smooth" });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showSignup} onOpenChange={setShowSignup}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Create Student Account
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign up with your university email
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSignup} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">University Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@university"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use your university email
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              className="text-primary hover:underline font-medium"
              disabled={isLoading}
            >
              Sign in
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
