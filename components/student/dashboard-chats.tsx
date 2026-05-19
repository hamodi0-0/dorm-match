import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RecentConversation } from "@/lib/types/student-dashboard";

export function DashboardChats({ conversations }: { conversations: RecentConversation[] }) {
  return (
    <Card className="py-0">
      <CardHeader className="px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
            </div>
            Recent Chats
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-xs h-7 gap-1 shrink-0">
            <Link href="/student/chats">
              All
              <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
            <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No messages yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Chat with listers from any listing.</p>
            </div>
          </div>
        ) : (
          conversations.map((conv, i) => {
            const timeAgo = formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true });
            return (
              <Link
                key={conv.id}
                href={`/student/chats/${conv.id}`}
                className={cn(
                  "flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors",
                  i < conversations.length - 1 && "border-b border-border/50"
                )}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{conv.listing_title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
