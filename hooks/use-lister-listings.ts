import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";

async function fetchListerListings(): Promise<Listing[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("lister_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Listing[];
}

export function useListerListings() {
  return useQuery({
    queryKey: ["lister-listings"],
    queryFn: fetchListerListings,
    staleTime: 60 * 1000,
  });
}
