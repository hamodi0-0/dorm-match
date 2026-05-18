import { ChatViewSkeleton } from "@/components/chats/chat-view-skeleton";
import { ListerDashboardHeaderSkeleton } from "@/components/lister/lister-dashboard-header-skeleton";

export default function ChatsLoading() {
  return (
    <>
      <ListerDashboardHeaderSkeleton />
      <ChatViewSkeleton />
    </>
  );
}
