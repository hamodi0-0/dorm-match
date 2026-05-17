"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Message, MessageInputProps } from "@/lib/types/chat";

export function MessageInput({
  conversationId,
  currentUserId,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSending) return;

    const messageContent = content.trim();
    setContent("");
    setIsSending(true);

    // Optimistic UI Update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: messageContent,
      read_at: null,
      created_at: new Date().toISOString(),
    };

    const previousMessages = queryClient.getQueryData<Message[]>([
      "messages",
      conversationId,
    ]);
    queryClient.setQueryData<Message[]>(["messages", conversationId], (old) => {
      if (!old) return [optimisticMessage];
      return [...old, optimisticMessage];
    });

    try {
      const supabase = createClient();

      const { data: newMessage, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: messageContent,
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        // Revert optimistic update
        queryClient.setQueryData(
          ["messages", conversationId],
          previousMessages,
        );
        // Put the content back so the user doesn't lose it
        setContent(messageContent);
      } else {
        // Swap temp message with real message
        queryClient.setQueryData<Message[]>(
          ["messages", conversationId],
          (old) => {
            if (!old) return [newMessage];
            return old.map((m) => (m.id === tempId ? newMessage : m));
          },
        );

        // Also update the updated_at on the conversation so it moves to top
        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 border-t border-border flex items-center gap-2 bg-background shrink-0"
    >
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-full bg-muted border-transparent focus-visible:ring-primary"
        autoFocus
      />
      <Button
        type="submit"
        size="icon"
        disabled={!content.trim() || isSending}
        className="rounded-full shrink-0 h-10 w-10"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
