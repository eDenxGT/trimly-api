import { inject, injectable } from "tsyringe";
import { ISendOtpEmailUseCase } from "../../entities/useCaseInterfaces/auth/sent-otp-usecase.interface";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import { IOtpService } from "../../entities/serviceInterfaces/otp-service.interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import chalk from "chalk";

@injectable()
export class SendOtpEmailUseCase implements ISendOtpEmailUseCase {
	constructor(
		@inject("IEmailService") private _emailService: IEmailService,
		@inject("IOtpService") private _otpService: IOtpService,
		@inject("IUserExistenceService")
		private _userExistenceService: IUserExistenceService,
		@inject("IOtpBcrypt") private _otpBcrypt: IBcrypt
	) {}
	async execute(email: string): Promise<void> {
		const emailExists = await this._userExistenceService.emailExists(email);
		if (emailExists) {
			throw new CustomError(
				ERROR_MESSAGES.EMAIL_EXISTS,
				HTTP_STATUS.CONFLICT
			);
		}

		const otp = this._otpService.generateOtp();
		console.log(
			chalk.yellowBright.bold(`OTP:`),
			chalk.greenBright.bold(otp)
		);
		const hashedOtp = await this._otpBcrypt.hash(otp);
		await this._otpService.storeOtp(email, hashedOtp);
		await this._emailService.sendOtpEmail(
			email,
			"Trimly - Verify Your Email",
			otp
		);
	}
}
