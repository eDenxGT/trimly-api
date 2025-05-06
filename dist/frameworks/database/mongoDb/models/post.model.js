import { model } from "mongoose";
import { postSchema } from "../schemas/post.schema.js";
export const PostModel = model("Post", postSchema);
