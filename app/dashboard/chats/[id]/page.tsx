import { ChatView } from "@/components/chats/chat-view";

export const metadata = {
  title: "Chat | Dormr",
};

interface ChatIdPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatIdPage({ params }: ChatIdPageProps) {
  const { id } = await params;
  return <ChatView conversationId={id} basePath="/dashboard/chats" />;
}
