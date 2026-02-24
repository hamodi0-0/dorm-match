"use client";

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
    .select(
      `
      *,
      listing_images (
        id,
        listing_id,
        storage_path,
        public_url,
        position,
        is_cover,
        created_at
      )
    `,
    )
    .eq("lister_id", user.id)
    .neq("status", "deleted")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Listing[];
}

/**
 * Data changes when the lister creates/edits/deletes listings → React Query
 * (this is user-driven change, not initial page load data).
 */
export function useListerListings(initialData?: Listing[]) {
  return useQuery({
    queryKey: ["lister-listings"],
    queryFn: fetchListerListings,
    initialData,
    staleTime: 30 * 1000, // 30 s — listings can change frequently during editing
  });
}
