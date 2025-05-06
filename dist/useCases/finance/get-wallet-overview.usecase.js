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
let GetWalletOverviewUseCase = class GetWalletOverviewUseCase {
    _getWalletByUserUseCase;
    _getTransactionByUserUseCase;
    _getWithdrawalByUserUseCase;
    constructor(_getWalletByUserUseCase, _getTransactionByUserUseCase, _getWithdrawalByUserUseCase) {
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
        this._getTransactionByUserUseCase = _getTransactionByUserUseCase;
        this._getWithdrawalByUserUseCase = _getWithdrawalByUserUseCase;
    }
    async execute(userId, role) {
        const wallet = await this._getWalletByUserUseCase.execute(userId, role);
        const transactions = await this._getTransactionByUserUseCase.execute(userId);
        const withdrawals = await this._getWithdrawalByUserUseCase.execute(userId);
        return {
            balance: wallet?.balance || 0,
            transactions: transactions || [],
            withdrawals: withdrawals || [],
        };
    }
};
GetWalletOverviewUseCase = __decorate([
    injectable(),
    __param(0, inject("IGetWalletByUserUseCase")),
    __param(1, inject("IGetTransactionByUserUseCase")),
    __param(2, inject("IGetWithdrawalByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetWalletOverviewUseCase);
export { GetWalletOverviewUseCase };
