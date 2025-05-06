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
import { OAuth2Client } from "google-auth-library";
import { inject, injectable } from "tsyringe";
import { ERROR_MESSAGES, GOOGLE_REGISTRATION_MAIL_CONTENT, HTTP_STATUS, } from "../../shared/constants.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { generateRandomPassword } from "../../shared/utils/random-password.helper.js";
let GoogleUseCase = class GoogleUseCase {
    _registerUserUseCase;
    _clientRepository;
    _barberRepository;
    _passwordBcrypt;
    _sendEmailUseCase;
    _oAuthClient;
    constructor(_registerUserUseCase, _clientRepository, _barberRepository, _passwordBcrypt, _sendEmailUseCase) {
        this._registerUserUseCase = _registerUserUseCase;
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._passwordBcrypt = _passwordBcrypt;
        this._sendEmailUseCase = _sendEmailUseCase;
        this._oAuthClient = new OAuth2Client();
    }
    async execute(credential, client_id, role) {
        const ticket = await this._oAuthClient.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new CustomError("Invalid or empty token payload", HTTP_STATUS.UNAUTHORIZED);
        }
        const googleId = payload.sub;
        const email = payload.email;
        const avatar = payload.picture || "";
        const fullName = payload.given_name || payload.family_name || "";
        if (!email) {
            throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
        }
        let repository;
        if (role === "client") {
            repository = this._clientRepository;
        }
        else if (role === "barber") {
            repository = this._barberRepository;
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const existingUser = await repository.findOne({ email });
        if (existingUser) {
            if (existingUser.status !== "active") {
                if (existingUser.status === "pending") {
                    throw new CustomError(ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION, HTTP_STATUS.FORBIDDEN);
                }
                throw new CustomError(ERROR_MESSAGES.BLOCKED, HTTP_STATUS.FORBIDDEN);
            }
            return existingUser;
        }
        if (role === "barber") {
            throw new CustomError("Barber Shop accounts cannot be created using Google. Please Register First.", HTTP_STATUS.FORBIDDEN);
        }
        const tempPassword = (await generateRandomPassword(fullName, email)).trim();
        const userData = {
            fullName,
            role,
            googleId,
            email,
            avatar,
            phoneNumber: "",
            password: tempPassword,
        };
        const newUser = await this._registerUserUseCase.execute(userData);
        if (!newUser) {
            throw new CustomError("Registration failed", HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        this._sendEmailUseCase.execute(email, "Welcome to Trimly! Your Google Registration is Complete 🎉", GOOGLE_REGISTRATION_MAIL_CONTENT(fullName, tempPassword));
        return newUser;
    }
};
GoogleUseCase = __decorate([
    injectable(),
    __param(0, inject("IRegisterUserUseCase")),
    __param(1, inject("IClientRepository")),
    __param(2, inject("IBarberRepository")),
    __param(3, inject("IPasswordBcrypt")),
    __param(4, inject("ISendEmailUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GoogleUseCase);
export { GoogleUseCase };
