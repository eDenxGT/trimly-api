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
import { HTTP_STATUS } from "../../../shared/constants.js";
let VerifyTopUpPaymentUseCase = class VerifyTopUpPaymentUseCase {
    _transactionRepository;
    _razorpayService;
    constructor(_transactionRepository, _razorpayService) {
        this._transactionRepository = _transactionRepository;
        this._razorpayService = _razorpayService;
    }
    async execute(razorpay_order_id, razorpay_payment_id, razorpay_signature, transactionId) {
        const isVerified = await this._razorpayService.verifySignature({
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature: razorpay_signature,
        });
        if (!isVerified) {
            throw new CustomError("Invalid signature. Payment verification failed.", HTTP_STATUS.BAD_REQUEST);
        }
        await this._transactionRepository.update({ transactionId }, { status: "success" });
    }
};
VerifyTopUpPaymentUseCase = __decorate([
    injectable(),
    __param(0, inject("ITransactionRepository")),
    __param(1, inject("IRazorpayService")),
    __metadata("design:paramtypes", [Object, Object])
], VerifyTopUpPaymentUseCase);
export { VerifyTopUpPaymentUseCase };
