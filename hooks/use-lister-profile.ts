import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface ListerProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

async function fetchListerProfile(): Promise<ListerProfile> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("lister_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Lister profile not found");

  return data as ListerProfile;
}

export function useListerProfile(initialData?: ListerProfile) {
  return useQuery({
    queryKey: ["lister-profile"],
    queryFn: fetchListerProfile,
    initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
