import { Schema } from "mongoose";
export const directMessageSchema = new Schema({
    messageId: { type: String, required: true },
    chatRoomId: {
        type: String,
        required: true,
    },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
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
}, {
    timestamps: { createdAt: "timestamp", updatedAt: false },
});
