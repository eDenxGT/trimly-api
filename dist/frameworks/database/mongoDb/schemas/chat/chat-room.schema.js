import { Schema } from "mongoose";
export const chatRoomSchema = new Schema({
    chatRoomId: { type: String, required: true },
    clientId: { type: String, required: true },
    barberId: { type: String, required: true },
}, {
    timestamps: true,
});
