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
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
let RegisterUserUseCase = class RegisterUserUseCase {
    _barberRepository;
    _clientRepository;
    _adminRepository;
    _passwordBcrypt;
    _userExistenceService;
    _createWalletUseCase;
    constructor(_barberRepository, _clientRepository, _adminRepository, _passwordBcrypt, _userExistenceService, _createWalletUseCase) {
        this._barberRepository = _barberRepository;
        this._clientRepository = _clientRepository;
        this._adminRepository = _adminRepository;
        this._passwordBcrypt = _passwordBcrypt;
        this._userExistenceService = _userExistenceService;
        this._createWalletUseCase = _createWalletUseCase;
    }
    async execute(user) {
        const { role, email, password } = user;
        const isEmailExisting = await this._userExistenceService.emailExists(email);
        if (isEmailExisting) {
            throw new CustomError(ERROR_MESSAGES.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
        }
        const hashedPassword = password
            ? await this._passwordBcrypt.hash(password)
            : null;
        const userId = generateUniqueId(role);
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
        await this._createWalletUseCase.execute({
            ownerId: userId,
            ownerType: role,
        });
        return await repository.save({
            ...user,
            password: hashedPassword ?? "",
            userId,
        });
    }
};
RegisterUserUseCase = __decorate([
    injectable(),
    __param(0, inject("IBarberRepository")),
    __param(1, inject("IClientRepository")),
    __param(2, inject("IAdminRepository")),
    __param(3, inject("IPasswordBcrypt")),
    __param(4, inject("IUserExistenceService")),
    __param(5, inject("ICreateWalletUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], RegisterUserUseCase);
export { RegisterUserUseCase };
