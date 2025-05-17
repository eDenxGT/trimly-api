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
import { addMinutes } from "date-fns";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { formatDate } from "../../shared/utils/date-formatter.js";
import { getBookingDateTimeUTC } from "../../shared/utils/get-booking-date-time-utc.helper.js";
let CompleteBookingUseCase = class CompleteBookingUseCase {
    _bookingRepository;
    _transactionRepository;
    _incrementWalletBalanceUseCase;
    _sendNotificationByUserUseCase;
    constructor(_bookingRepository, _transactionRepository, _incrementWalletBalanceUseCase, _sendNotificationByUserUseCase) {
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
        this._incrementWalletBalanceUseCase = _incrementWalletBalanceUseCase;
        this._sendNotificationByUserUseCase = _sendNotificationByUserUseCase;
    }
    async execute(bookingId, role) {
        const booking = await this._bookingRepository.findOne({ bookingId });
        if (!booking) {
            throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        const bookingStartTime = getBookingDateTimeUTC(booking.date, booking.startTime);
        const bookingEndTime = addMinutes(bookingStartTime, booking.duration);
        const now = new Date();
        if (now < bookingEndTime) {
            throw new CustomError(ERROR_MESSAGES.BOOKING_CANNOT_COMPLETE_BEFORE_TIME_ENDS, HTTP_STATUS.BAD_REQUEST);
        }
        const transaction = await this._transactionRepository.findOne({
            referenceId: bookingId,
            source: "booking",
            status: "success",
        });
        if (!transaction) {
            throw new CustomError(ERROR_MESSAGES.TRANSACTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        await this._bookingRepository.update({ bookingId }, { status: "completed" });
        await this._transactionRepository.save({
            transactionId: generateUniqueId("transaction"),
            userId: booking.shopId,
            amount: booking.total,
            type: "credit",
            source: "booking",
            status: "success",
            referenceId: bookingId,
        });
        await this._incrementWalletBalanceUseCase.execute({
            ownerId: booking.shopId,
            amount: booking.total,
            role: role,
        });
        await this._sendNotificationByUserUseCase.execute({
            receiverId: booking.shopId,
            message: `Booking completed for ${formatDate(booking.date.toString())} at ${booking.startTime}.`,
        });
        await this._sendNotificationByUserUseCase.execute({
            receiverId: booking.clientId,
            message: `Your booking is completed for ${formatDate(booking.date.toString())} at ${booking.startTime}.`,
        });
    }
};
CompleteBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("ITransactionRepository")),
    __param(2, inject("IIncrementWalletBalanceUseCase")),
    __param(3, inject("ISendNotificationByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CompleteBookingUseCase);
export { CompleteBookingUseCase };
