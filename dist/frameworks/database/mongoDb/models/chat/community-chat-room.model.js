import { model } from "mongoose";
import { communityChatRoomSchema } from "../../schemas/chat/community-chat-room.schema.js";
export const CommunityModel = model("Community", communityChatRoomSchema);
