export interface Conversation {
  id: string;
  student_id: string;
  lister_id: string;
  listing_id: string | null;
  created_at: string;
  updated_at: string;

  // Joined relations for UI
  student?: { full_name: string; avatar_url: string | null };
  lister?: { full_name: string; avatar_url: string | null };
  listing?: { title: string };

  // Computed fields
  last_message?: Message;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
  basePath: string;
}

export interface ChatViewProps {
  conversationId?: string;
  basePath: string;
  currentUserId: string;
}

export interface ChatIdPageProps {
  params: Promise<{ id: string }>;
}

export interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  currentUserId: string;
  basePath: string;
}

export interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
}
