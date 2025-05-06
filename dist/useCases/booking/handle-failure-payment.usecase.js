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
let HandleFailurePaymentUseCase = class HandleFailurePaymentUseCase {
    _bookingRepository;
    _transactionRepository;
    constructor(_bookingRepository, _transactionRepository) {
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
    }
    async execute(orderId, status) {
        const booking = await this._bookingRepository.update({ orderId }, { status });
        await this._transactionRepository.update({
            referenceId: booking?.bookingId,
            source: "booking",
        }, {
            status: "failed",
        });
    }
};
HandleFailurePaymentUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object])
], HandleFailurePaymentUseCase);
export { HandleFailurePaymentUseCase };
