import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";

async function fetchListings(): Promise<Listing[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*, listing_images(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Listing[];
}

export function useListings(initialData?: Listing[]) {
  return useQuery({
    queryKey: ["listings"],
    queryFn: fetchListings,
    initialData,
    staleTime: 2 * 60 * 1000, // 2 min — listings change, keep reasonably fresh
  });
}
