"use client";

import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { isTestAccount } from "@/lib/helpers/test-user";

interface InitChatParams {
  listerId: string;
  listingId: string;
}

export function useInitChat() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ listerId, listingId }: InitChatParams) => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      if (isTestAccount(user.email))
        throw new Error("Action disabled for test accounts");

      // Check if conversation already exists (same student, lister, and listing)
      const { data: existing, error: existingError } = await supabase
        .from("conversations")
        .select("id")
        .eq("student_id", user.id)
        .eq("lister_id", listerId)
        .eq("listing_id", listingId)
        .maybeSingle();

      if (existingError) {
        console.error("Error checking existing conversation:", existingError);
        throw new Error("Failed to check conversation status");
      }

      if (existing) {
        return existing.id;
      }

      // If not exists, insert a new conversation
      const { data: newConv, error: insertError } = await supabase
        .from("conversations")
        .insert({
          student_id: user.id,
          lister_id: listerId,
          listing_id: listingId,
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Error creating conversation:", insertError);
        throw new Error("Failed to create conversation");
      }

      return newConv.id;
    },
    onSuccess: (conversationId) => {
      router.push(`/student/chats/${conversationId}`);
    },
  });
}
