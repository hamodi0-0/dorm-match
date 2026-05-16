"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Conversation, Message } from "@/lib/types/chat";

async function fetchConversations(): Promise<Conversation[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: conversationsData, error: conversationsError } = await supabase
    .from("conversations")
    .select(`*, listing:listings(title)`)
    .or(`student_id.eq.${user.id},lister_id.eq.${user.id}`)
    .order("updated_at", { ascending: false });

  if (conversationsError) {
    console.error("Error fetching conversations:", conversationsError);
    return [];
  }

  const conversationIds = conversationsData.map((c) => c.id);
  if (conversationIds.length === 0) return [];

  const studentIds = [...new Set(conversationsData.map((c) => c.student_id))];
  const listerIds = [...new Set(conversationsData.map((c) => c.lister_id))];

  const [
    { data: studentProfilesData },
    { data: listerProfilesData },
    { data: messagesData, error: messagesError },
  ] = await Promise.all([
    supabase
      .from("student_profiles")
      .select("id, full_name, avatar_url")
      .in("id", studentIds),
    supabase
      .from("lister_profiles")
      .select("id, full_name, avatar_url")
      .in("id", listerIds),
    supabase
      .from("messages")
      .select("*")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false }),
  ]);

  if (messagesError) {
    console.error("Error fetching messages for conversations:", messagesError);
  }

  const messages = (messagesData as Message[]) || [];
  const studentMap = new Map((studentProfilesData || []).map((p) => [p.id, p]));
  const listerMap = new Map((listerProfilesData || []).map((p) => [p.id, p]));

  const enrichedConversations = conversationsData.map((conv) => {
    const student = studentMap.get(conv.student_id) || {
      full_name: "Unknown Student",
      avatar_url: null,
    };
    const lister = listerMap.get(conv.lister_id) || {
      full_name: "Unknown Lister",
      avatar_url: null,
    };
    const listing = Array.isArray(conv.listing)
      ? conv.listing[0]
      : conv.listing;

    const convMessages = messages.filter((m) => m.conversation_id === conv.id);
    const lastMessage = convMessages[0];
    const unreadCount = convMessages.filter(
      (m) => m.sender_id !== user.id && m.read_at === null,
    ).length;

    return {
      ...conv,
      student,
      lister,
      listing,
      last_message: lastMessage,
      unread_count: unreadCount,
    };
  });

  return enrichedConversations as Conversation[];
}

export function useConversations(initialData?: Conversation[]) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const query = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    initialData,
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("realtime:all-messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });

          if (
            payload.eventType === "INSERT" &&
            payload.new &&
            (payload.new as Record<string, unknown>)["conversation_id"]
          ) {
            const newMsg = payload.new as Message;
            queryClient.setQueryData<Message[]>(
              ["messages", newMsg.conversation_id],
              (old) => {
                if (!old) return [newMsg];
                if (old.some((m) => m.id === newMsg.id)) return old;
                return [...old, newMsg];
              },
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  return query;
}
