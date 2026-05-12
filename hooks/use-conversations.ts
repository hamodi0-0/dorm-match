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

  // Fetch conversations where the user is either the student or the lister
  const { data: conversationsData, error: conversationsError } = await supabase
    .from("conversations")
    .select(
      `
      *,
      listing:listings(title)
    `,
    )
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

  // Batch fetch profiles due to auth.users FK join quirks
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

  // Create lookup maps
  const studentMap = new Map((studentProfilesData || []).map((p) => [p.id, p]));
  const listerMap = new Map((listerProfilesData || []).map((p) => [p.id, p]));

  // Attach last_message, unread_count, and mapped profiles
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
    const lastMessage = convMessages[0]; // Already ordered by created_at desc

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
    staleTime: 0, // Always refetch to ensure we get the latest when remounting
  });

  // Global realtime subscription for the sidebar
  useEffect(() => {
    // We subscribe to all new messages so the sidebar can update immediately when someone texts us
    const channel = supabase
      .channel("realtime:all-messages")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT or UPDATE
          schema: "public",
          table: "messages",
        },
        (payload) => {
          // Invalidate the conversations cache so the sidebar immediately updates
          queryClient.invalidateQueries({ queryKey: ["conversations"] });

          // Also invalidate the specific conversation's messages just in case
          // Immediately update local cache for the active chat window
          if (payload.eventType === "INSERT" && payload.new && (payload.new as any).conversation_id) {
            queryClient.setQueryData<Message[]>(
              ["messages", (payload.new as any).conversation_id],
              (old) => {
                if (!old) return [payload.new as Message];
                if (old.some((m) => m.id === (payload.new as any).id)) return old;
                return [...old, payload.new as Message];
              }
            );
          }

          if (payload.new && (payload.new as any).conversation_id) {
            queryClient.invalidateQueries({
              queryKey: ["messages", (payload.new as any).conversation_id],
            });
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
