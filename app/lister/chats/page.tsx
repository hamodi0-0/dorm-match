// app/lister/chats/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatView } from "@/components/chats/chat-view";

export const metadata = { title: "Chats | Dormr" };

export default async function ListerChatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  return <ChatView basePath="/lister/chats" currentUserId={user.id} />;
}
