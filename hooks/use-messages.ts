"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/lib/types/chat";
import { useChatStore } from "@/lib/stores/chat-store";
import { getConversationKey, tryDecryptMessage } from "@/lib/crypto";

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

  const messages = data as Message[];

  try {
    const key = await getConversationKey(conversationId);
    return await Promise.all(
      messages.map(async (msg) => ({
        ...msg,
        content: await tryDecryptMessage(msg.content, key),
      })),
    );
  } catch {
    return messages; // fallback: return without decrypting
  }
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
          const rawMessage = payload.new as Message;

          // Decrypt before adding to cache
          let decryptedMessage = rawMessage;
          try {
            const key = await getConversationKey(conversationId);
            decryptedMessage = {
              ...rawMessage,
              content: await tryDecryptMessage(rawMessage.content, key),
            };
          } catch {
            // fallback: use raw
          }

          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (old) => {
              if (!old) return [decryptedMessage];
              if (old.some((m) => m.id === decryptedMessage.id)) return old;
              return [...old, decryptedMessage];
            },
          );

          queryClient.invalidateQueries({ queryKey: ["conversations"] });

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user && rawMessage.sender_id !== user.id) {
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
          // handled optimistically in chat-window
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
