"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityModel = void 0;
const mongoose_1 = require("mongoose");
const community_chat_room_schema_1 = require("../../schemas/chat/community-chat-room.schema");
exports.CommunityModel = (0, mongoose_1.model)("Community", community_chat_room_schema_1.communityChatRoomSchema);
