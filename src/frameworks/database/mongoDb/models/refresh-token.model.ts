import { Document, model, ObjectId } from "mongoose";
import { refreshTokenSchema } from "../schemas/refresh-token.schema";
import { IRefreshTokenEntity } from "../../../../entities/models/refresh-token.entity";
export interface IRefreshTokenModel extends IRefreshTokenEntity, Document {
	_id: ObjectId;
}

export const RefreshTokenModel = model<IRefreshTokenModel>(
	"RefreshToken",
	refreshTokenSchema
);
