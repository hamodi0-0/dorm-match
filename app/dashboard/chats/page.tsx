import { ChatView } from "@/components/chats/chat-view";

export const metadata = {
  title: "Chats | Dormr",
};

export default function ChatsPage() {
  return <ChatView basePath="/dashboard/chats" />;
}
