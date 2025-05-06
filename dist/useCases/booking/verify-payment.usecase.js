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
import crypto from "crypto";
import { config } from "../../shared/config.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { HTTP_STATUS } from "../../shared/constants.js";
let VerifyPaymentUseCase = class VerifyPaymentUseCase {
    _bookingRepository;
    _transactionRepository;
    constructor(_bookingRepository, _transactionRepository) {
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
    }
    async execute(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId) {
        const secret = config.payment.RAZORPAY_SECRET;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            throw new CustomError("Invalid signature. Payment verification failed.", HTTP_STATUS.BAD_REQUEST);
        }
        await this._bookingRepository.update({ bookingId }, { status: "confirmed" });
        await this._transactionRepository.update({ referenceId: bookingId, source: "booking" }, { status: "success" });
    }
};
VerifyPaymentUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object])
], VerifyPaymentUseCase);
export { VerifyPaymentUseCase };
