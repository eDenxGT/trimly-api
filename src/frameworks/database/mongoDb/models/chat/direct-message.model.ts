import { Document, model, ObjectId } from "mongoose";
import { IDirectMessageEntity } from "../../../../../entities/models/chat/direct-message.entity";
import { directMessageSchema } from "../../schemas/chat/direct-message.schema";

export interface IDirectMessageModel extends IDirectMessageEntity, Document {
  _id: ObjectId;
}

export const DirectMessageModel = model<IDirectMessageModel>(
  "DirectMessage",
  directMessageSchema
);
