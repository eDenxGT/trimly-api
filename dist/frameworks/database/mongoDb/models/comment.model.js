import { model } from "mongoose";
import { commentSchema } from "../schemas/comment.schema.js";
export const CommentModel = model("Comment", commentSchema);
