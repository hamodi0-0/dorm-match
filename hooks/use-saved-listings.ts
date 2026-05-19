"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";

export interface SavedListingWithDetails {
  id: string;
  user_id: string;
  listing_id: string;
  created_at: string;
  listing: Listing;
}

export function useSavedListingsQuery() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["saved-listings"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("saved_listings")
        .select(
          `
          id,
          user_id,
          listing_id,
          created_at,
          listing:listings (
            *,
            listing_images (*)
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Ensure data is structured properly due to array joins in generic typed responses
      return (data as any[]).map((row) => ({
        ...row,
        listing: Array.isArray(row.listing) ? row.listing[0] : row.listing,
      })) as SavedListingWithDetails[];
    },
  });
}

export function useToggleSaveListing() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      isSaved,
    }: {
      listingId: string;
      isSaved: boolean;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from("saved_listings")
          .delete()
          .eq("user_id", user.id)
          .eq("listing_id", listingId);

        if (error) throw error;
        return { saved: false, listingId };
      } else {
        // Save
        const { error } = await supabase.from("saved_listings").insert({
          user_id: user.id,
          listing_id: listingId,
        });

        if (error) throw error;
        return { saved: true, listingId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-listings"] });
    },
  });
}
