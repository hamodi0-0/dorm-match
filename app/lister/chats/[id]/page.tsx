// app/lister/chats/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatView } from "@/components/chats/chat-view";
import { ChatIdPageProps } from "@/lib/types/chat";

export const metadata = { title: "Chat | Dormr" };

export default async function ListerChatIdPage({ params }: ChatIdPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  return (
    <ChatView
      conversationId={id}
      basePath="/lister/chats"
      currentUserId={user.id}
    />
  );
}
