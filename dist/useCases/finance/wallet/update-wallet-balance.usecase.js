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
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants.js";
import { CustomError } from "../../../entities/utils/custom.error.js";
let UpdateWalletBalanceUseCase = class UpdateWalletBalanceUseCase {
    _walletRepository;
    _transactionRepository;
    _createWalletUseCase;
    _getWalletByUserUseCase;
    constructor(_walletRepository, _transactionRepository, _createWalletUseCase, _getWalletByUserUseCase) {
        this._walletRepository = _walletRepository;
        this._transactionRepository = _transactionRepository;
        this._createWalletUseCase = _createWalletUseCase;
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
    }
    async execute(userId, role, transactionId) {
        const transaction = await this._transactionRepository.findOne({
            transactionId,
        });
        if (!transaction) {
            throw new CustomError(ERROR_MESSAGES.WRONG_ID, HTTP_STATUS.BAD_REQUEST);
        }
        if (transaction.userId !== userId) {
            throw new CustomError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, HTTP_STATUS.UNAUTHORIZED);
        }
        if (transaction.status !== "success") {
            throw new CustomError(ERROR_MESSAGES.INVALID_TRANSACTION, HTTP_STATUS.BAD_REQUEST);
        }
        let wallet = await this._getWalletByUserUseCase.execute(userId, role);
        wallet.balance += transaction.amount;
        await this._walletRepository.update({ ownerId: userId }, { balance: wallet.balance });
    }
};
UpdateWalletBalanceUseCase = __decorate([
    injectable(),
    __param(0, inject("IWalletRepository")),
    __param(1, inject("ITransactionRepository")),
    __param(2, inject("ICreateWalletUseCase")),
    __param(3, inject("IGetWalletByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], UpdateWalletBalanceUseCase);
export { UpdateWalletBalanceUseCase };
