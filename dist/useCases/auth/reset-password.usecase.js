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
let ResetPasswordUseCase = class ResetPasswordUseCase {
    _clientRepository;
    _barberRepository;
    _adminRepository;
    _tokenService;
    _redisTokenRepository;
    _passwordBcrypt;
    constructor(_clientRepository, _barberRepository, _adminRepository, _tokenService, _redisTokenRepository, _passwordBcrypt) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._adminRepository = _adminRepository;
        this._tokenService = _tokenService;
        this._redisTokenRepository = _redisTokenRepository;
        this._passwordBcrypt = _passwordBcrypt;
    }
    async execute({ password, role, token, }) {
        const payload = this._tokenService.verifyResetToken(token);
        if (!payload || !payload.email) {
            throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.BAD_REQUEST);
        }
        const email = payload.email;
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
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const tokenValid = await this._redisTokenRepository.verifyResetToken(user.userId ?? "", token);
        if (!tokenValid) {
            throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN, HTTP_STATUS.BAD_REQUEST);
        }
        const isSamePasswordAsOld = await this._passwordBcrypt.compare(password, user.password);
        if (isSamePasswordAsOld) {
            throw new CustomError(ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD, HTTP_STATUS.BAD_REQUEST);
        }
        const hashedPassword = await this._passwordBcrypt.hash(password);
        await repository.update({ email }, { password: hashedPassword });
        await this._redisTokenRepository.deleteResetToken(user.userId ?? "");
    }
};
ResetPasswordUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IBarberRepository")),
    __param(2, inject("IAdminRepository")),
    __param(3, inject("ITokenService")),
    __param(4, inject("IRedisTokenRepository")),
    __param(5, inject("IPasswordBcrypt")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ResetPasswordUseCase);
export { ResetPasswordUseCase };
