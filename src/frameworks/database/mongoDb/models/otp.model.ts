import { Document, model, ObjectId } from "mongoose";
import { otpSchema } from "../schemas/otp.schema";
import { IOtpEntity } from "../../../../entities/models/opt.entity";

export interface IOtpModel extends IOtpEntity, Document {
	_id: ObjectId;
}

export const OtpModel = model<IOtpModel>("Otp", otpSchema);