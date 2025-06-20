"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityMessageModel = void 0;
const mongoose_1 = require("mongoose");
const community_message_schema_1 = require("../../schemas/chat/community-message.schema");
exports.CommunityMessageModel = (0, mongoose_1.model)("CommunityMessage", community_message_schema_1.communityMessageSchema);
