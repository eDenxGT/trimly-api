import { model } from "mongoose";
import { meetingRoomSchema } from "../../schemas/chat/meeting-room.schema.js";
export const MeetingRoomModel = model("MeetingRoom", meetingRoomSchema);
