var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import chalk from "chalk";
let SendOtpEmailUseCase = class SendOtpEmailUseCase {
    _emailService;
    _otpService;
    _userExistenceService;
    _otpBcrypt;
    constructor(_emailService, _otpService, _userExistenceService, _otpBcrypt) {
        this._emailService = _emailService;
        this._otpService = _otpService;
        this._userExistenceService = _userExistenceService;
        this._otpBcrypt = _otpBcrypt;
    }
    async execute(email) {
        const emailExists = await this._userExistenceService.emailExists(email);
        if (emailExists) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
        }
        const otp = this._otpService.generateOtp();
        console.log(chalk.yellowBright.bold(`OTP:`), chalk.greenBright.bold(otp));
        const hashedOtp = await this._otpBcrypt.hash(otp);
        await this._otpService.storeOtp(email, hashedOtp);
        await this._emailService.sendOtpEmail(email, "Trimly - Verify Your Email", otp);
    }
};
SendOtpEmailUseCase = __decorate([
    injectable(),
    __param(0, inject("IEmailService")),
    __param(1, inject("IOtpService")),
    __param(2, inject("IUserExistenceService")),
    __param(3, inject("IOtpBcrypt")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], SendOtpEmailUseCase);
export { SendOtpEmailUseCase };
