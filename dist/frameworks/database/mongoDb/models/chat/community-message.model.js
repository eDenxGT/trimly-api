import { model } from "mongoose";
import { communityMessageSchema } from "../../schemas/chat/community-message.schema.js";
export const CommunityMessageModel = model("CommunityMessage", communityMessageSchema);
