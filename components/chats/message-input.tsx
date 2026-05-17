"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/lib/types/chat";
import { encryptMessage, getConversationKey } from "@/lib/crypto";

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
}

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

    // Optimistic update with plaintext — user sees their message immediately
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

      // Encrypt before writing to DB
      const key = await getConversationKey(conversationId);
      const encryptedContent = await encryptMessage(messageContent, key);

      const { data: newMessage, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: encryptedContent, // ciphertext goes to DB
        })
        .select()
        .single();

      if (error) {
        console.error("Error sending message:", error);
        queryClient.setQueryData(
          ["messages", conversationId],
          previousMessages,
        );
        setContent(messageContent);
      } else {
        // Swap temp ID for real ID — keep the original plaintext, not the encrypted blob
        queryClient.setQueryData<Message[]>(
          ["messages", conversationId],
          (old) => {
            if (!old) return [{ ...newMessage, content: messageContent }];
            return old.map((m) =>
              m.id === tempId ? { ...newMessage, content: messageContent } : m,
            );
          },
        );

        await supabase
          .from("conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
    } catch (err) {
      console.error("Error encrypting/sending message:", err);
      queryClient.setQueryData(["messages", conversationId], previousMessages);
      setContent(messageContent);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 border-t mx-2 rounded-xl border-border flex items-center gap-2 bg-background shrink-0"
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
