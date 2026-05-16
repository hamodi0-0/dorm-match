"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConversations } from "@/hooks/use-conversations";
import { fetchMessages } from "@/hooks/use-messages";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { useChatStore } from "@/lib/stores/chat-store";
import { MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ConversationRowSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4 border-b border-border/50">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-36" />
      </div>
    </div>
  );
}

function ChatViewSkeleton() {
  return (
    <div
      className="flex w-full overflow-hidden bg-background border-y sm:border sm:rounded-xl sm:my-6 sm:mx-auto sm:max-w-6xl shadow-sm"
      style={{
        height: "calc(100vh - 220px)",
        minHeight: "500px",
        maxHeight: "800px",
      }}
    >
      <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border shrink-0">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <ConversationRowSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl" />
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ChatViewProps {
  conversationId?: string;
  basePath: string;
  currentUserId: string;
}

export function ChatView({
  conversationId,
  basePath,
  currentUserId,
}: ChatViewProps) {
  const queryClient = useQueryClient();
  const { data: conversations, isLoading } = useConversations();
  const { setActiveConversationId } = useChatStore();

  useEffect(() => {
    setActiveConversationId(conversationId || null);
    return () => setActiveConversationId(null);
  }, [conversationId, setActiveConversationId]);

  // Prefetch messages for all conversations so clicking any is instant
  useEffect(() => {
    if (!conversations?.length) return;
    conversations.forEach((conv) => {
      queryClient.prefetchQuery({
        queryKey: ["messages", conv.id],
        queryFn: () => fetchMessages(conv.id),
        staleTime: 0,
      });
    });
  }, [conversations, queryClient]);

  if (isLoading) {
    return <ChatViewSkeleton />;
  }

  const activeConversation = conversations?.find(
    (c) => c.id === conversationId,
  );

  return (
    <div
      className="flex w-full overflow-hidden bg-background border-y sm:border sm:rounded-xl sm:my-6 sm:mx-auto sm:max-w-6xl shadow-sm"
      style={{
        height: "calc(100vh - 220px)",
        minHeight: "500px",
        maxHeight: "800px",
      }}
    >
      {/* Sidebar */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${
          conversationId ? "hidden md:flex" : "flex"
        }`}
      >
        <ChatSidebar
          conversations={conversations || []}
          activeId={conversationId}
          currentUserId={currentUserId}
          basePath={basePath}
        />
      </div>

      {/* Main area */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-0 ${
          !conversationId ? "hidden md:flex" : "flex"
        }`}
      >
        {conversationId && activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={currentUserId}
            basePath={basePath}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/60">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">
              No conversation selected
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm">
              Select a conversation to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
