import { Document, model, ObjectId } from "mongoose";
import { IReviewEntity } from "../../../../entities/models/review.entity";
import { reviewSchema } from "../schemas/review.schema";

export interface IReviewModel extends IReviewEntity, Document {
  _id: ObjectId;
}

export const ReviewModel = model<IReviewModel>("Review", reviewSchema);
