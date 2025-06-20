import { Document, model, ObjectId } from "mongoose";
import { IHairstyleEntity } from "../../../../entities/models/hairstyle.entity";
import { hairstyleSchema } from "../schemas/hairstyle.schema";

export interface IHairstyleModel extends IHairstyleEntity, Document {
  _id: ObjectId;
}

export const HairstyleModel = model<IHairstyleModel>(
  "Hairstyle",
  hairstyleSchema
);
