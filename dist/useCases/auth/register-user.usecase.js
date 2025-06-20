"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../entities/utils/custom.error");
const constants_1 = require("../../shared/constants");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
let RegisterUserUseCase = class RegisterUserUseCase {
    constructor(_barberRepository, _clientRepository, _adminRepository, _passwordBcrypt, _userExistenceService, _createWalletUseCase) {
        this._barberRepository = _barberRepository;
        this._clientRepository = _clientRepository;
        this._adminRepository = _adminRepository;
        this._passwordBcrypt = _passwordBcrypt;
        this._userExistenceService = _userExistenceService;
        this._createWalletUseCase = _createWalletUseCase;
    }
    execute(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role, email, password } = user;
            const isEmailExisting = yield this._userExistenceService.emailExists(email);
            if (isEmailExisting) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.EMAIL_EXISTS, constants_1.HTTP_STATUS.CONFLICT);
            }
            const hashedPassword = password
                ? yield this._passwordBcrypt.hash(password)
                : null;
            const userId = (0, unique_uuid_helper_1.generateUniqueId)(role);
            let repository;
            if (role === "client") {
                repository = this._clientRepository;
            }
            else if (role === "barber") {
                repository = this._barberRepository;
            }
            else {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._createWalletUseCase.execute({
                ownerId: userId,
                ownerType: role,
            });
            return yield repository.save(Object.assign(Object.assign({}, user), { password: hashedPassword !== null && hashedPassword !== void 0 ? hashedPassword : "", userId }));
        });
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBarberRepository")),
    __param(1, (0, tsyringe_1.inject)("IClientRepository")),
    __param(2, (0, tsyringe_1.inject)("IAdminRepository")),
    __param(3, (0, tsyringe_1.inject)("IPasswordBcrypt")),
    __param(4, (0, tsyringe_1.inject)("IUserExistenceService")),
    __param(5, (0, tsyringe_1.inject)("ICreateWalletUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], RegisterUserUseCase);
