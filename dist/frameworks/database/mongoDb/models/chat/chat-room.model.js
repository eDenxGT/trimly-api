import { model } from "mongoose";
import { chatRoomSchema } from "../../schemas/chat/chat-room.schema.js";
export const ChatRoomModel = model("ChatRoom", chatRoomSchema);
