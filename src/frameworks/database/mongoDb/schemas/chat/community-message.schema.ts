import { Schema } from "mongoose";
import { ICommunityMessageModel } from "../../models/chat/community-message.model";

export const communityMessageSchema = new Schema<ICommunityMessageModel>(
  {
    messageId: { type: String, required: true },
    communityId: {
      type: String,
      required: true,
    },
    senderId: { type: String, required: true },
    messageType: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },
    content: { type: String, default: null },
    mediaUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    readBy: [
      {
        type: String
      },
    ],
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);
