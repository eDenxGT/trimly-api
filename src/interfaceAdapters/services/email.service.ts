import chalk from "chalk";
import { injectable } from "tsyringe";
import nodemailer from "nodemailer";
import { config } from "../../shared/config";
import { IEmailService } from "../../entities/serviceInterfaces/email-service.interface";
import {
	PASSWORD_RESET_MAIL_CONTENT,
	VERIFICATION_MAIL_CONTENT,
} from "../../shared/constants";

@injectable()
export class EmailService implements IEmailService {
	private _transporter;

	constructor() {
		this._transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: config.nodemailer.EMAIL_USER,
				pass: config.nodemailer.EMAIL_PASS,
			},
		});
	}

	private async _sendMail(mailOptions: {
		from: string;
		to: string;
		subject: string;
		html: string;
	}) {
		const info = await this._transporter.sendMail(mailOptions);
		console.log(chalk.bgGreenBright.bold(`📧 Email sent:`), info.response);
	}

	async sendOtpEmail(
		to: string,
		subject: string,
		otp: string
	): Promise<void> {
		const mailOptions = {
			from: `"Trimly" <${config.nodemailer.EMAIL_USER}>`,
			to,
			subject,
			html: VERIFICATION_MAIL_CONTENT(otp),
		};
		await this._sendMail(mailOptions);
	}

	async sendResetEmail(
		to: string,
		subject: string,
		resetLink: string
	): Promise<void> {
		const mailOptions = {
			from: `"Trimly" <${config.nodemailer.EMAIL_USER}>`,
			to,
			subject,
			html: PASSWORD_RESET_MAIL_CONTENT(resetLink),
		};
		await this._sendMail(mailOptions);
		console.log(
			chalk.bgYellowBright.bold(
				`🔁 Reset Password Link:`
			),
				chalk.cyanBright.bold(resetLink)
		);
	}

	async sendCustomEmail(
		to: string,
		subject: string,
		content: string
	): Promise<void> {
		const mailOptions = {
			from: `"Trimly" <${config.nodemailer.EMAIL_USER}>`,
			to,
			subject,
			html: content,
		};
		await this._sendMail(mailOptions);
	}
}
