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
import { generateUniqueId } from "../../../shared/utils/unique-uuid.helper.js";
let WithdrawFromWalletUseCase = class WithdrawFromWalletUseCase {
    _walletRepository;
    _withdrawalRepository;
    _transactionRepository;
    _getWalletByUserUseCase;
    constructor(_walletRepository, _withdrawalRepository, _transactionRepository, _getWalletByUserUseCase) {
        this._walletRepository = _walletRepository;
        this._withdrawalRepository = _withdrawalRepository;
        this._transactionRepository = _transactionRepository;
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
    }
    async execute(userId, role, amount, method, accountDetails) {
        const wallet = await this._getWalletByUserUseCase.execute(userId, role);
        if (!wallet) {
            throw new CustomError(ERROR_MESSAGES.WALLET_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
        }
        if (amount > wallet.balance) {
            throw new CustomError(ERROR_MESSAGES.INSUFFICIENT_BALANCE, HTTP_STATUS.BAD_REQUEST);
        }
        const withdrawalId = generateUniqueId("withdrawal");
        await this._withdrawalRepository.save({
            withdrawalId,
            walletId: wallet.walletId,
            userId,
            userType: role,
            amount,
            method,
            status: "pending",
            ...accountDetails,
            requestedAt: new Date(),
        });
        await this._walletRepository.decrementBalance(userId, amount);
        await this._transactionRepository.save({
            transactionId: generateUniqueId("transaction"),
            userId,
            walletId: wallet.walletId,
            type: "debit",
            source: "withdrawal",
            amount,
            status: "pending",
            referenceId: withdrawalId,
        });
    }
};
WithdrawFromWalletUseCase = __decorate([
    injectable(),
    __param(0, inject("IWalletRepository")),
    __param(1, inject("IWithdrawalRepository")),
    __param(2, inject("ITransactionRepository")),
    __param(3, inject("IGetWalletByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], WithdrawFromWalletUseCase);
export { WithdrawFromWalletUseCase };
