import { Document, model, ObjectId } from "mongoose";
import { ICommunityChatRoomEntity } from "../../../../../entities/models/chat/community-chat-room.entity";
import { communityChatRoomSchema } from "../../schemas/chat/community-chat-room.schema";

export interface ICommunityChatRoomModel
  extends ICommunityChatRoomEntity,
    Document {
  _id: ObjectId;
}

export const CommunityModel = model<ICommunityChatRoomModel>(
  "Community",
  communityChatRoomSchema
);
