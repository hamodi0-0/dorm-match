"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/lib/types/chat";
import { useChatStore } from "@/lib/stores/chat-store";

export async function fetchMessages(
  conversationId: string,
): Promise<Message[]> {
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
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
  });

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

          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (old) => {
              if (!old) return [newMessage];
              if (old.some((m) => m.id === newMessage.id)) return old;
              return [...old, newMessage];
            },
          );

          queryClient.invalidateQueries({ queryKey: ["conversations"] });

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
        () => {
          // handled by optimistic updates in chat-window
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
