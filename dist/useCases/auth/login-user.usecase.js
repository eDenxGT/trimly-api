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
let LoginUserUseCase = class LoginUserUseCase {
    _clientRepository;
    _barberRepository;
    _adminRepository;
    _passwordBcrypt;
    constructor(_clientRepository, _barberRepository, _adminRepository, _passwordBcrypt) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._adminRepository = _adminRepository;
        this._passwordBcrypt = _passwordBcrypt;
    }
    async execute(user) {
        let repository;
        if (user.role === "client") {
            repository = this._clientRepository;
        }
        else if (user.role === "barber") {
            repository = this._barberRepository;
        }
        else if (user.role === "admin") {
            repository = this._adminRepository;
        }
        else {
            throw new CustomError(ERROR_MESSAGES.INVALID_ROLE, HTTP_STATUS.BAD_REQUEST);
        }
        const userData = await repository.findOne({ email: user.email });
        if (!userData) {
            throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        // if (userData.status === "pending") {
        // 	throw new CustomError(
        // 		ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION,
        // 		HTTP_STATUS.FORBIDDEN
        // 	);
        // }
        if (userData.status === "blocked") {
            throw new CustomError(ERROR_MESSAGES.BLOCKED, HTTP_STATUS.FORBIDDEN);
        }
        if (user.password) {
            const isPasswordMatch = await this._passwordBcrypt.compare(user.password, userData.password);
            console.log(user.password, isPasswordMatch);
            if (!isPasswordMatch) {
                throw new CustomError(ERROR_MESSAGES.INVALID_CREDENTIALS, HTTP_STATUS.FORBIDDEN);
            }
        }
        return userData;
    }
};
LoginUserUseCase = __decorate([
    injectable(),
    __param(0, inject("IClientRepository")),
    __param(1, inject("IBarberRepository")),
    __param(2, inject("IAdminRepository")),
    __param(3, inject("IPasswordBcrypt")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], LoginUserUseCase);
export { LoginUserUseCase };
