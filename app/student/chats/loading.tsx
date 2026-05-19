import { ChatViewSkeleton } from "@/components/chats/chat-view-skeleton";
import { DashboardHeaderSkeleton } from "@/components/student/dashboard-header-skeleton";

export default function ChatsLoading() {
  return (
    <>
      <DashboardHeaderSkeleton />
      <ChatViewSkeleton />
    </>
  );
}
