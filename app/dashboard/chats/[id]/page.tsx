// app/dashboard/chats/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatView } from "@/components/chats/chat-view";

export const metadata = { title: "Chat | Dormr" };

interface ChatIdPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatIdPage({ params }: ChatIdPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  return (
    <ChatView
      conversationId={id}
      basePath="/dashboard/chats"
      currentUserId={user.id}
    />
  );
}
