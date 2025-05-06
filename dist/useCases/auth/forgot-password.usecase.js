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
import { config } from "../../shared/config.js";
let ForgotPasswordUseCase = class ForgotPasswordUseCase {
    _clientRepository;
    _barberRepository;
    _adminRepository;
    _tokenService;
    _redisTokenRepository;
    _emailService;
    constructor(_clientRepository, _barberRepository, _adminRepository, _tokenService, _redisTokenRepository, _emailService) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._adminRepository = _adminRepository;
        this._tokenService = _tokenService;
        this._redisTokenRepository = _redisTokenRepository;
        this._emailService = _emailService;
    }
    async execute({ email, role, }) {
        let repository;
        if (role === "client") {
            repository = this._clientRepository;
        }
        else if (role === "barber") {
            repository = this._barberRepository;
        }
        else if (role === "admin") {
            repository = this._adminRepository;
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.FORBIDDEN);
        }
        const user = await repository.findOne({ email });
        if (!user) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const resetToken = this._tokenService.generateResetToken(email);
        try {
            await this._redisTokenRepository.storeResetToken(user.userId ?? "", resetToken);
        }
        catch (error) {
            console.error("Failed to store reset token in Redis:", error);
            throw new CustomError(ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
        const rolePrefix = role !== "client" ? `/${role}` : "";
        const resetUrl = new URL(`${rolePrefix}/reset-password/${resetToken}`, config.cors.ALLOWED_ORIGIN).toString();
        await this._emailService.sendResetEmail(email, "Trimly - Reset your password", resetUrl);
    }
};
ForgotPasswordUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IBarberRepository")),
    __param(2, inject("IAdminRepository")),
    __param(3, inject("ITokenService")),
    __param(4, inject("IRedisTokenRepository")),
    __param(5, inject("IEmailService")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ForgotPasswordUseCase);
export { ForgotPasswordUseCase };
