"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/lib/types/chat";
import { useChatStore } from "@/lib/stores/chat-store";

async function fetchMessages(conversationId: string): Promise<Message[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data as Message[];
}

export function useMessages(conversationId: string, initialData?: Message[]) {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { activeConversationId, incrementUnreadCount } = useChatStore();

  const query = useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: () => fetchMessages(conversationId),
    initialData,
    enabled: !!conversationId,
    // When staleTime is too high, navigating away and back causes the chat view to show
    // cached messages without refetching, preventing new messages from showing up.
    staleTime: 0,
  });

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`realtime:messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // Immediately update UI cache without waiting for refetch
          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (old) => {
              if (!old) return [newMessage];
              if (old.some((m) => m.id === newMessage.id)) return old;
              return [...old, newMessage];
            }
          );

          // Still invalidate to ensure synchronization
          queryClient.invalidateQueries({ queryKey: ["conversations"] });

          queryClient.invalidateQueries({
            queryKey: ["messages", conversationId],
          });



          // If message is from someone else and this chat isn't currently open, update unread count
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user && newMessage.sender_id !== user.id) {
            if (activeConversationId !== conversationId) {
              incrementUnreadCount();
            }
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // E.g. message getting marked as read
          queryClient.invalidateQueries({
            queryKey: ["messages", conversationId],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    conversationId,
    queryClient,
    supabase,
    activeConversationId,
    incrementUnreadCount,
  ]);

  return query;
}
