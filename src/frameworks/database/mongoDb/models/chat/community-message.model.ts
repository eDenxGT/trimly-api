import { Document, model, ObjectId } from "mongoose";
import { ICommunityMessageEntity } from "../../../../../entities/models/chat/community-message.entity";
import { communityMessageSchema } from "../../schemas/chat/community-message.schema";

export interface ICommunityMessageModel
  extends ICommunityMessageEntity,
    Document {
  _id: ObjectId;
}

export const CommunityMessageModel = model<ICommunityMessageModel>(
  "CommunityMessage",
  communityMessageSchema
);
