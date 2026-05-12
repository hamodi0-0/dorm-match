"use client";

import { useConversations } from "@/hooks/use-conversations";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { Loader2 } from "lucide-react";

export function ChatView({ 
  conversationId, 
  basePath 
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
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeConversation = conversations?.find(c => c.id === conversationId);

  return (
    <div className="flex-1 flex overflow-hidden bg-background h-full">
      {/* Sidebar - hidden on mobile if a conversation is active */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col ${conversationId ? 'hidden md:flex' : 'flex'}`}>
        <ChatSidebar 
          conversations={conversations || []} 
          activeId={conversationId} 
          currentUserId={currentUserId}
          basePath={basePath}
        />
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
        {conversationId && activeConversation ? (
          <ChatWindow 
            conversation={activeConversation} 
            currentUserId={currentUserId}
            basePath={basePath}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-center p-4">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
