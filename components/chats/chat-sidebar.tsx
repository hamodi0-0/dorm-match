"use client";

import { Conversation } from "@/lib/types/chat";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Inbox, MessageSquare } from "lucide-react";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  currentUserId: string;
  basePath: string;
}

export function ChatSidebar({
  conversations,
  activeId,
  currentUserId,
  basePath,
}: ChatSidebarProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/60">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-lg font-semibold">Nothing here yet</h2>
        <p className="mt-2 text-center text-sm leading-6 text-muted-foreground max-w-[200px]">
          No conversations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-border shrink-0">
        <h2 className="text-lg font-semibold font-serif">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          // Identify the 'other' person
          const isStudent = conv.student_id === currentUserId;
          const otherUser = isStudent ? conv.lister : conv.student;
          const participantName = otherUser?.full_name || "Unknown User";
          const initials = participantName.substring(0, 2).toUpperCase();

          const hasUnread = (conv.unread_count || 0) > 0;
          const isActive = activeId === conv.id;

          return (
            <Link
              key={conv.id}
              href={`${basePath}/${conv.id}`}
              className={cn(
                "flex items-start gap-3 p-4 border-b border-border/50 hover:bg-muted/50 transition-colors",
                isActive && "bg-muted",
              )}
            >
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
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={cn(
                      "text-sm font-medium truncate",
                      hasUnread && "font-bold text-foreground",
                    )}
                  >
                    {participantName}
                  </span>
                  {conv.updated_at && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(conv.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
                {conv.listing && (
                  <p className="text-xs text-primary/80 truncate mb-1">
                    {conv.listing.title}
                  </p>
                )}
                <p
                  className={cn(
                    "text-xs truncate",
                    hasUnread
                      ? "text-foreground font-medium"
                      : "text-muted-foreground",
                  )}
                >
                  {conv.last_message?.content || "No messages yet"}
                </p>
              </div>
              {hasUnread && (
                <div className="shrink-0 pt-1">
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                    {conv.unread_count}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
