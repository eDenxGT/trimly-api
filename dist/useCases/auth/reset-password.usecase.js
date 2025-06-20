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
exports.ResetPasswordUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../entities/utils/custom.error");
const constants_1 = require("../../shared/constants");
let ResetPasswordUseCase = class ResetPasswordUseCase {
    constructor(_clientRepository, _barberRepository, _adminRepository, _tokenService, _redisTokenRepository, _passwordBcrypt) {
        this._clientRepository = _clientRepository;
        this._barberRepository = _barberRepository;
        this._adminRepository = _adminRepository;
        this._tokenService = _tokenService;
        this._redisTokenRepository = _redisTokenRepository;
        this._passwordBcrypt = _passwordBcrypt;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ password, role, token, }) {
            var _b, _c;
            const payload = this._tokenService.verifyResetToken(token);
            if (!payload || !payload.email) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_TOKEN, constants_1.HTTP_STATUS.BAD_REQUEST);
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
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_ROLE, constants_1.HTTP_STATUS.FORBIDDEN);
            }
            const user = yield repository.findOne({ email });
            if (!user) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.USER_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const tokenValid = yield this._redisTokenRepository.verifyResetToken((_b = user.userId) !== null && _b !== void 0 ? _b : "", token);
            if (!tokenValid) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INVALID_TOKEN, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const isSamePasswordAsOld = yield this._passwordBcrypt.compare(password, user.password);
            if (isSamePasswordAsOld) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const hashedPassword = yield this._passwordBcrypt.hash(password);
            yield repository.update({ email }, { password: hashedPassword });
            yield this._redisTokenRepository.deleteResetToken((_c = user.userId) !== null && _c !== void 0 ? _c : "");
        });
    }
};
exports.ResetPasswordUseCase = ResetPasswordUseCase;
exports.ResetPasswordUseCase = ResetPasswordUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IClientRepository")),
    __param(1, (0, tsyringe_1.inject)("IBarberRepository")),
    __param(2, (0, tsyringe_1.inject)("IAdminRepository")),
    __param(3, (0, tsyringe_1.inject)("ITokenService")),
    __param(4, (0, tsyringe_1.inject)("IRedisTokenRepository")),
    __param(5, (0, tsyringe_1.inject)("IPasswordBcrypt")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], ResetPasswordUseCase);
