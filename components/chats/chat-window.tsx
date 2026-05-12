"use client";

import { useEffect, useRef } from "react";
import { Conversation, Message } from "@/lib/types/chat";
import { useMessages } from "@/hooks/use-messages";
import { MessageInput } from "./message-input";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useChatStore } from "@/lib/stores/chat-store";

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
  basePath: string;
}

export function ChatWindow({
  conversation,
  currentUserId,
  basePath,
}: ChatWindowProps) {
  const { data: messages, isLoading } = useMessages(conversation.id);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { decrementUnreadCount } = useChatStore();

  const isStudent = conversation.student_id === currentUserId;
  const otherUser = isStudent ? conversation.lister : conversation.student;
  const participantName = otherUser?.full_name || "Unknown User";
  const initials = participantName.substring(0, 2).toUpperCase();

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (!messages) return;

    const unreadMessages = messages.filter(
      (m) => m.sender_id !== currentUserId && m.read_at === null,
    );

    if (unreadMessages.length > 0) {
      const markAsRead = async () => {
        const supabase = createClient();
        const now = new Date().toISOString();

        const { error } = await supabase
          .from("messages")
          .update({ read_at: now })
          .in(
            "id",
            unreadMessages.map((m) => m.id),
          );

        if (!error) {
          // Optimistically update the messages cache so we don't trigger this again while waiting for realtime
          queryClient.setQueryData<Message[]>(
            ["messages", conversation.id],
            (old) => {
              if (!old) return old;
              return old.map((m) =>
                unreadMessages.some((u) => u.id === m.id)
                  ? { ...m, read_at: now }
                  : m,
              );
            },
          );

          for (let i = 0; i < unreadMessages.length; i++) {
            decrementUnreadCount();
          }

          // Invalidate so Sidebar reflects no unread
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      };

      markAsRead();
    }
  }, [
    messages,
    currentUserId,
    decrementUnreadCount,
    queryClient,
    conversation.id,
  ]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background shrink-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="md:hidden shrink-0"
        >
          <Link href={basePath}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage
            src={otherUser?.avatar_url || ""}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold truncate">{participantName}</h2>
          {conversation.listing && (
            <p className="text-xs text-muted-foreground truncate">
              Re: {conversation.listing.title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages?.map((message) => {
          const isMe = message.sender_id === currentUserId;

          return (
            <div
              key={message.id}
              className={cn(
                "flex flex-col max-w-[80%]",
                isMe ? "self-end items-end" : "self-start items-start",
              )}
            >
              <div
                className={cn(
                  "px-4 py-2 rounded-2xl",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm",
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1 px-1">
                {format(new Date(message.created_at), "h:mm a")}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Placeholder */}
      <MessageInput
        conversationId={conversation.id}
        currentUserId={currentUserId}
      />
    </div>
  );
}
