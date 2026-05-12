import { ChatView } from "@/components/chats/chat-view";

export const metadata = {
  title: "Chats | Dormr",
};

export default function ListerChatsPage() {
  return <ChatView basePath="/lister/chats" />;
}
