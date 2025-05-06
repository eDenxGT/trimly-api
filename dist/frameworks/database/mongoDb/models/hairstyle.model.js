import { model } from "mongoose";
import { hairstyleSchema } from "../schemas/hairstyle.schema.js";
export const HairstyleModel = model("Hairstyle", hairstyleSchema);
