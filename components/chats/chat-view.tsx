"use client";

import { useConversations } from "@/hooks/use-conversations";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { MessageSquare } from "lucide-react";
import { PageLoader } from "../ui/page-loader";

export function ChatView({
  conversationId,
  basePath,
}: {
  conversationId?: string;
  basePath: string;
}) {
  const { data: conversations, isLoading } = useConversations();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { setActiveConversationId } = useChatStore();

  useEffect(() => {
    setActiveConversationId(conversationId || null);
    return () => setActiveConversationId(null);
  }, [conversationId, setActiveConversationId]);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    }
    getUser();
  }, []);

  if (isLoading || !currentUserId) {
    return <PageLoader className="min-h-[50vh]" />;
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
      {/* Sidebar - hidden on mobile if a conversation is active */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${conversationId ? "hidden md:flex" : "flex"}`}
      >
        <ChatSidebar
          conversations={conversations || []}
          activeId={conversationId}
          currentUserId={currentUserId}
          basePath={basePath}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-0 ${!conversationId ? "hidden md:flex" : "flex"}`}
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
