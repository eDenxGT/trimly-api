import { model } from "mongoose";
import { reviewSchema } from "../schemas/review.schema.js";
export const ReviewModel = model("Review", reviewSchema);
