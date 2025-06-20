import { Document, model, ObjectId } from "mongoose";
import { IPostEntity } from "../../../../entities/models/post.entity";
import { postSchema } from "../schemas/post.schema";

export interface IPostModel extends IPostEntity, Document {
  _id: ObjectId;
}

export const PostModel = model<IPostModel>("Post", postSchema);
