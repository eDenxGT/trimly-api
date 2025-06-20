"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directMessageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.directMessageSchema = new mongoose_1.Schema({
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
