"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  SavedListingQueryRow,
  SavedListingWithDetails,
} from "@/lib/types/listing";

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

      return (data ?? [])
        .map((row) => {
          const savedRow = row as SavedListingQueryRow;
          const listing = Array.isArray(savedRow.listing)
            ? savedRow.listing[0]
            : savedRow.listing;

          if (!listing) return null;

          return {
            ...savedRow,
            listing,
          };
        })
        .filter((row): row is SavedListingWithDetails => row !== null);
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
