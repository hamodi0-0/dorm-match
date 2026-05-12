import { ChatView } from "@/components/chats/chat-view";

export const metadata = {
  title: "Chat | Dormr",
};

interface ChatIdPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListerChatIdPage({ params }: ChatIdPageProps) {
  const { id } = await params;
  return <ChatView conversationId={id} basePath="/lister/chats" />;
}
