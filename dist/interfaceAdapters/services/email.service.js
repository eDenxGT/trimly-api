var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import chalk from "chalk";
import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import { config } from "../../shared/config.js";
import { PASSWORD_RESET_MAIL_CONTENT, VERIFICATION_MAIL_CONTENT, } from "../../shared/constants.js";
let EmailService = class EmailService {
    _transporter;
    constructor() {
        this._transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.nodemailer.EMAIL_USER,
                pass: config.nodemailer.EMAIL_PASS,
            },
        });
    }
    async _sendMail(mailOptions) {
        const info = await this._transporter.sendMail(mailOptions);
        console.log(chalk.bgGreenBright.bold(`📧 Email sent:`), info.response);
    }
    async sendOtpEmail(to, subject, otp) {
        const mailOptions = {
            from: `"Trimly" <${config.nodemailer.EMAIL_USER}>`,
            to,
            subject,
            html: VERIFICATION_MAIL_CONTENT(otp),
        };
        await this._sendMail(mailOptions);
    }
    async sendResetEmail(to, subject, resetLink) {
        const mailOptions = {
            from: `"Trimly" <${config.nodemailer.EMAIL_USER}>`,
            to,
            subject,
            html: PASSWORD_RESET_MAIL_CONTENT(resetLink),
        };
        await this._sendMail(mailOptions);
        console.log(chalk.bgYellowBright.bold(`🔁 Reset Password Link:`), chalk.cyanBright.bold(resetLink));
    }
    async sendCustomEmail(to, subject, content) {
        const mailOptions = {
            from: `"Trimly" <${config.nodemailer.EMAIL_USER}>`,
            to,
            subject,
            html: content,
        };
        await this._sendMail(mailOptions);
    }
};
EmailService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], EmailService);
export { EmailService };
