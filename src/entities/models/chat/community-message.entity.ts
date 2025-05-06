export interface ICommunityMessageEntity {
  messageId: string;
  communityId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  messageType: "text" | "image";
  content: string | null;
  mediaUrl?: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  readBy: string[];
}
