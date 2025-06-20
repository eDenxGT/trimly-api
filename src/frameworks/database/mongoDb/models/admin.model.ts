import { Document, model, ObjectId } from "mongoose";
import { adminSchema } from "../schemas/admin.schema";
import { IAdminEntity } from "../../../../entities/models/admin.entity";

export interface IAdminModel extends IAdminEntity, Document {
	_id: ObjectId;
}

export const AdminModel = model<IAdminModel>("Admin", adminSchema);
