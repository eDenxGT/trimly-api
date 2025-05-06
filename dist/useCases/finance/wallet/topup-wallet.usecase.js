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
let TopUpWalletUseCase = class TopUpWalletUseCase {
    _transactionRepository;
    _razorpayService;
    _getWalletByUserUseCase;
    constructor(_transactionRepository, _razorpayService, _getWalletByUserUseCase) {
        this._transactionRepository = _transactionRepository;
        this._razorpayService = _razorpayService;
        this._getWalletByUserUseCase = _getWalletByUserUseCase;
    }
    async execute(userId, role, transactionId, amount) {
        const razorpayOrder = await this._razorpayService.createOrder(amount, transactionId);
        await this._getWalletByUserUseCase.execute(userId, role);
        await this._transactionRepository.save({
            transactionId,
            userId,
            amount,
            orderId: razorpayOrder.id,
            type: "credit",
            source: "topup",
            status: "pending",
            referenceId: razorpayOrder.id,
        });
        return {
            orderId: razorpayOrder.id,
            amount,
            currency: razorpayOrder.currency,
        };
    }
};
TopUpWalletUseCase = __decorate([
    injectable(),
    __param(0, inject("ITransactionRepository")),
    __param(1, inject("IRazorpayService")),
    __param(2, inject("IGetWalletByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], TopUpWalletUseCase);
export { TopUpWalletUseCase };
