"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityMessageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.communityMessageSchema = new mongoose_1.Schema({
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
}, {
    timestamps: { createdAt: "timestamp", updatedAt: false },
});
