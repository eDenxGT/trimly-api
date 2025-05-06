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
import { CustomError } from "../../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
let IncrementWalletBalanceUseCase = class IncrementWalletBalanceUseCase {
    _getWalletByUserUseCase;
    _walletRepository;
    constructor(_getWalletByUserUseCase, _walletRepository) {
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
        this._walletRepository = _walletRepository;
    }
    async execute({ ownerId, amount, role, }) {
        const hasWallet = await this._getWalletByUserUseCase.execute(ownerId, role);
        if (!hasWallet) {
            throw new CustomError(ERROR_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const updatedWallet = await this._walletRepository.incrementBalance(ownerId, amount);
        if (!updatedWallet) {
            throw new CustomError(ERROR_MESSAGES.WALLET_UPDATE_FAILED, HTTP_STATUS.NOT_FOUND);
        }
        return updatedWallet;
    }
};
IncrementWalletBalanceUseCase = __decorate([
    injectable(),
    __param(0, inject("IGetWalletByUserUseCase")),
    __param(1, inject("IWalletRepository")),
    __metadata("design:paramtypes", [Object, Object])
], IncrementWalletBalanceUseCase);
export { IncrementWalletBalanceUseCase };
