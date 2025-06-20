"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingRoomModel = void 0;
const mongoose_1 = require("mongoose");
const meeting_room_schema_1 = require("../../schemas/chat/meeting-room.schema");
exports.MeetingRoomModel = (0, mongoose_1.model)("MeetingRoom", meeting_room_schema_1.meetingRoomSchema);
