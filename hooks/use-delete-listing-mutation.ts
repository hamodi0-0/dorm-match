"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Listing } from "@/lib/types/listing";

async function deleteListing(id: string): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", id)
    .eq("lister_id", user.id); // extra guard — RLS also enforces this

  if (error) throw error;
}

export function useDeleteListingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["lister-listings"] });

      const previousListings = queryClient.getQueryData<Listing[]>([
        "lister-listings",
      ]);

      // Optimistically remove from cache
      queryClient.setQueryData<Listing[]>(
        ["lister-listings"],
        (old) => old?.filter((l) => l.id !== id) ?? [],
      );

      return { previousListings };
    },
    onError: (_error, _id, context) => {
      // Roll back on failure
      if (context?.previousListings) {
        queryClient.setQueryData(["lister-listings"], context.previousListings);
      }
    },
    onSuccess: () => {
      // Refetch to make sure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["lister-listings"] });
    },
  });
}
