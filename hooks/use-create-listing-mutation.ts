import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { CreateListingInput, Listing } from "@/lib/types/listing";

async function createListing(input: CreateListingInput): Promise<Listing> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("listings")
    .insert({ ...input, lister_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data as Listing;
}

// Complex form (many fields, real-time validation) → React Query Mutation + RHF + Zod
export function useCreateListingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lister-listings"] });
    },
  });
}
