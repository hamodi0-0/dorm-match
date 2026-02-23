"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";
import type { CreateListingValues } from "@/lib/schemas/listing-schema";

interface UpdateListingInput {
  id: string;
  updates: Partial<CreateListingValues>;
}

async function updateListing({
  id,
  updates,
}: UpdateListingInput): Promise<Listing> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("listings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("lister_id", user.id) // extra guard — RLS also enforces this
    .select()
    .single();

  if (error) throw error;
  return data as Listing;
}

export function useUpdateListingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateListing,
    onMutate: async ({ id, updates }) => {
      // Cancel in-flight fetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["lister-listings"] });

      const previousListings = queryClient.getQueryData<Listing[]>([
        "lister-listings",
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<Listing[]>(
        ["lister-listings"],
        (old) =>
          old?.map((l) => (l.id === id ? { ...l, ...updates } : l)) ?? [],
      );

      return { previousListings };
    },
    onError: (_error, _variables, context) => {
      // Roll back on failure
      if (context?.previousListings) {
        queryClient.setQueryData(["lister-listings"], context.previousListings);
      }
    },
    onSuccess: (updatedListing) => {
      // Replace the specific listing with the server response
      queryClient.setQueryData<Listing[]>(
        ["lister-listings"],
        (old) =>
          old?.map((l) => (l.id === updatedListing.id ? updatedListing : l)) ??
          [],
      );
    },
  });
}
