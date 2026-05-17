import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatView } from "@/components/chats/chat-view";
import { ListerDashboardHeader } from "@/components/lister/lister-dashboard-header";

export const metadata = { title: "Chats | Dormr" };

export default async function ListerChatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  return (
    <>
      <ListerDashboardHeader title="Chats" />
      <ChatView basePath="/lister/chats" currentUserId={user.id} />
    </>
  );
}
