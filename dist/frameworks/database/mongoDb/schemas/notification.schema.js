import { Schema } from "mongoose";
export const notificationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    notificationId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
