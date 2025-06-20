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
exports.GetWalletOverviewUseCase = void 0;
const tsyringe_1 = require("tsyringe");
let GetWalletOverviewUseCase = class GetWalletOverviewUseCase {
    constructor(_getWalletByUserUseCase, _getTransactionByUserUseCase, _getWithdrawalByUserUseCase) {
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
        this._getTransactionByUserUseCase = _getTransactionByUserUseCase;
        this._getWithdrawalByUserUseCase = _getWithdrawalByUserUseCase;
    }
    execute(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this._getWalletByUserUseCase.execute(userId, role);
            const transactions = yield this._getTransactionByUserUseCase.execute(userId);
            const withdrawals = yield this._getWithdrawalByUserUseCase.execute(userId);
            return {
                balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0,
                transactions: transactions || [],
                withdrawals: withdrawals || [],
            };
        });
    }
};
exports.GetWalletOverviewUseCase = GetWalletOverviewUseCase;
exports.GetWalletOverviewUseCase = GetWalletOverviewUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetWalletByUserUseCase")),
    __param(1, (0, tsyringe_1.inject)("IGetTransactionByUserUseCase")),
    __param(2, (0, tsyringe_1.inject)("IGetWithdrawalByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetWalletOverviewUseCase);
