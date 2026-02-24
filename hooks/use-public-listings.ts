"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";

export interface ListingFilters {
  search?: string;
  roomType?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  availableFrom?: string;
}

async function fetchPublicListings(
  filters: ListingFilters = {},
): Promise<Listing[]> {
  const supabase = createClient();

  let query = supabase
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
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (filters.roomType && filters.roomType !== "all") {
    query = query.eq("room_type", filters.roomType);
  }
  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }
  if (filters.minPrice !== undefined) {
    query = query.gte("price_per_month", filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte("price_per_month", filters.maxPrice);
  }
  if (filters.availableFrom) {
    query = query.lte("available_from", filters.availableFrom);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Listing[];
}

/**
 * Public listing data changes frequently as listers create/update listings → React Query.
 * Server component passes initialData for a zero-loading-state experience on first render.
 */
export function usePublicListings(
  initialData?: Listing[],
  filters: ListingFilters = {},
) {
  return useQuery({
    queryKey: ["public-listings", filters],
    queryFn: () => fetchPublicListings(filters),
    initialData: Object.keys(filters).length === 0 ? initialData : undefined,
    staleTime: 60 * 1000, // 1 min
  });
}
