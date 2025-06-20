"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.notificationSchema = new mongoose_1.Schema({
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
    timestamps: { createdAt: true, updatedAt: true },
});
