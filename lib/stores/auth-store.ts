import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
type AuthState = {
  isLoggedIn: boolean;
  isOnboarded: boolean;
  isChecking: boolean;
  showLogin: boolean;
  showSignup: boolean;
  checkAuthStatus: () => Promise<void>;
  setShowLogin: (open: boolean) => void;
  setShowSignup: (open: boolean) => void;
  loginSuccess: () => Promise<void>;
  signupSuccess: () => Promise<void>;
  handleSetupProfile: (isLoggedIn: boolean) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isOnboarded: false,
  isChecking: true,
  showLogin: false,
  showSignup: false,

  checkAuthStatus: async () => {
    set({ isChecking: true });
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (user.user_metadata?.user_type === "student") {
          set({ isLoggedIn: true });

          const { data: profile } = await supabase
            .from("student_profiles")
            .select("profile_completed")
            .eq("id", user.id)
            .single();

          if (profile?.profile_completed) {
            set({ isOnboarded: true });
          } else {
            set({ isOnboarded: false });
          }
        } else {
          await supabase.auth.signOut();
          set({ isLoggedIn: false, isOnboarded: false });
        }
      } else {
        set({ isLoggedIn: false, isOnboarded: false });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ isLoggedIn: false, isOnboarded: false });
    } finally {
      set({ isChecking: false });
    }
  },

  setShowLogin: (open: boolean) => set({ showLogin: open }),
  setShowSignup: (open: boolean) => set({ showSignup: open }),

  loginSuccess: async () => {
    set({ showLogin: false });
    await get().checkAuthStatus();
  },

  signupSuccess: async () => {
    set({ showSignup: false });
    await get().checkAuthStatus();
  },

  handleSetupProfile: (isLoggedIn: boolean) => {
    if (!isLoggedIn) {
      get().setShowSignup(true);
    } else {
      redirect("/onboarding");
    }
  },
}));

export default useAuthStore;
