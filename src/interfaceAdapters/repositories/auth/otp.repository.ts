import { injectable } from "tsyringe";
import { IOtpEntity } from "../../../entities/models/opt.entity";
import {
	IOtpModel,
	OtpModel,
} from "../../../frameworks/database/mongoDb/models/otp.model";
import { BaseRepository } from "../base.repository";

@injectable()
export class OtpRepository extends BaseRepository<IOtpModel> {
	constructor() {
		super(OtpModel);
	}
	async findLatestOtp(email: string): Promise<IOtpEntity | null> {
		return this.model.findOne({ email }).sort({ createdAt: -1 }).exec();
	}
}
