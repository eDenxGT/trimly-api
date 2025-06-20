"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectMessageModel = void 0;
const mongoose_1 = require("mongoose");
const direct_message_schema_1 = require("../../schemas/chat/direct-message.schema");
exports.DirectMessageModel = (0, mongoose_1.model)("DirectMessage", direct_message_schema_1.directMessageSchema);
