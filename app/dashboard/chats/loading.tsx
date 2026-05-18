import { ChatViewSkeleton } from "@/components/chats/chat-view-skeleton";
import { DashboardHeaderSkeleton } from "@/components/dashboard/dashboard-header-skeleton";

export default function ChatsLoading() {
  return (
    <>
      <DashboardHeaderSkeleton />
      <ChatViewSkeleton />
    </>
  );
}
