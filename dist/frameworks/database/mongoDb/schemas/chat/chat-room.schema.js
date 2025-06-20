"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoomSchema = void 0;
const mongoose_1 = require("mongoose");
exports.chatRoomSchema = new mongoose_1.Schema({
    chatRoomId: { type: String, required: true },
    clientId: { type: String, required: true },
    barberId: { type: String, required: true },
}, {
    timestamps: true,
});
