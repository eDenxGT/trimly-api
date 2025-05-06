import { model } from "mongoose";
import { directMessageSchema } from "../../schemas/chat/direct-message.schema.js";
export const DirectMessageModel = model("DirectMessage", directMessageSchema);
