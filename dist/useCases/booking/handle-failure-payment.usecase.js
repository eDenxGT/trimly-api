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
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { formatDate } from "../../shared/utils/date-formatter.js";
let HandleFailurePaymentUseCase = class HandleFailurePaymentUseCase {
    _bookingRepository;
    _transactionRepository;
    _sendNotificationByUserUseCase;
    constructor(_bookingRepository, _transactionRepository, _sendNotificationByUserUseCase) {
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
        this._sendNotificationByUserUseCase = _sendNotificationByUserUseCase;
    }
    async execute(orderId, status) {
        const booking = await this._bookingRepository.update({ orderId }, { status });
        if (!booking) {
            throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        await this._transactionRepository.update({
            referenceId: booking?.bookingId,
            source: "booking",
        }, {
            status: "failed",
        });
        await this._sendNotificationByUserUseCase.execute({
            receiverId: booking.clientId,
            message: `Your booking is cancelled for ${formatDate(booking.date.toString())} at ${booking.startTime} due to failed payment.`,
        });
    }
};
HandleFailurePaymentUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("ITransactionRepository")),
    __param(2, inject("ISendNotificationByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], HandleFailurePaymentUseCase);
export { HandleFailurePaymentUseCase };
