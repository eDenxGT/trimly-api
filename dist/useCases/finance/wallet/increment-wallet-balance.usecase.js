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
exports.IncrementWalletBalanceUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../entities/utils/custom.error");
const constants_1 = require("../../../shared/constants");
let IncrementWalletBalanceUseCase = class IncrementWalletBalanceUseCase {
    constructor(_getWalletByUserUseCase, _walletRepository) {
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
        this._walletRepository = _walletRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ ownerId, amount, role, }) {
            const hasWallet = yield this._getWalletByUserUseCase.execute(ownerId, role);
            if (!hasWallet) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.WALLET_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const updatedWallet = yield this._walletRepository.incrementBalance(ownerId, amount);
            if (!updatedWallet) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.WALLET_UPDATE_FAILED, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            return updatedWallet;
        });
    }
};
exports.IncrementWalletBalanceUseCase = IncrementWalletBalanceUseCase;
exports.IncrementWalletBalanceUseCase = IncrementWalletBalanceUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetWalletByUserUseCase")),
    __param(1, (0, tsyringe_1.inject)("IWalletRepository")),
    __metadata("design:paramtypes", [Object, Object])
], IncrementWalletBalanceUseCase);
