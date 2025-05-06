import { model } from "mongoose";
import { adminSchema } from "../schemas/admin.schema.js";
export const AdminModel = model("Admin", adminSchema);
