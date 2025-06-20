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
exports.WithdrawFromWalletUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../../entities/utils/custom.error");
const constants_1 = require("../../../shared/constants");
const unique_uuid_helper_1 = require("../../../shared/utils/unique-uuid.helper");
let WithdrawFromWalletUseCase = class WithdrawFromWalletUseCase {
    constructor(_walletRepository, _withdrawalRepository, _transactionRepository, _getWalletByUserUseCase) {
        this._walletRepository = _walletRepository;
        this._withdrawalRepository = _withdrawalRepository;
        this._transactionRepository = _transactionRepository;
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
    }
    execute(userId, role, amount, method, accountDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._getWalletByUserUseCase.execute(userId, role);
            if (!wallet) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.WALLET_NOT_FOUND, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (amount > wallet.balance) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INSUFFICIENT_BALANCE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const withdrawalId = (0, unique_uuid_helper_1.generateUniqueId)("withdrawal");
            yield this._withdrawalRepository.save(Object.assign(Object.assign({ withdrawalId, walletId: wallet.walletId, userId, userType: role, amount,
                method, status: "pending" }, accountDetails), { requestedAt: new Date() }));
            yield this._walletRepository.decrementBalance(userId, amount);
            yield this._transactionRepository.save({
                transactionId: (0, unique_uuid_helper_1.generateUniqueId)("transaction"),
                userId,
                walletId: wallet.walletId,
                type: "debit",
                source: "withdrawal",
                amount,
                status: "pending",
                referenceId: withdrawalId,
            });
        });
    }
};
exports.WithdrawFromWalletUseCase = WithdrawFromWalletUseCase;
exports.WithdrawFromWalletUseCase = WithdrawFromWalletUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(1, (0, tsyringe_1.inject)("IWithdrawalRepository")),
    __param(2, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(3, (0, tsyringe_1.inject)("IGetWalletByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], WithdrawFromWalletUseCase);
