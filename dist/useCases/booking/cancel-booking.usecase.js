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
import { parse, format } from "date-fns";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { formatDate } from "../../shared/utils/date-formatter.js";
let CancelBookingUseCase = class CancelBookingUseCase {
    _bookingRepository;
    _barberRepository;
    _walletRepository;
    _transactionRepository;
    _sendNotificationByUserUseCase;
    constructor(_bookingRepository, _barberRepository, _walletRepository, _transactionRepository, _sendNotificationByUserUseCase) {
        this._bookingRepository = _bookingRepository;
        this._barberRepository = _barberRepository;
        this._walletRepository = _walletRepository;
        this._transactionRepository = _transactionRepository;
        this._sendNotificationByUserUseCase = _sendNotificationByUserUseCase;
    }
    async execute(bookingId) {
        const booking = await this._bookingRepository.findOne({ bookingId });
        if (!booking) {
            throw new CustomError(ERROR_MESSAGES.BOOKING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        if (booking.status === "cancelled")
            return;
        const bookingDate = new Date(booking.date);
        const startTimeStr = booking.startTime;
        const fullDateTimeStr = `${format(bookingDate, "yyyy-MM-dd")} ${startTimeStr}`;
        const bookingStartTime = parse(fullDateTimeStr, "yyyy-MM-dd h:mm a", new Date());
        const now = new Date();
        if (booking.status === "pending") {
            await this._bookingRepository.update({ bookingId }, { status: "cancelled" });
            await this._transactionRepository.update({
                referenceId: bookingId,
                source: "booking",
            }, {
                status: "failed",
            });
            return;
        }
        const diffInMs = bookingStartTime.getTime() - now.getTime();
        const diffInMinutes = diffInMs / (1000 * 60);
        if (diffInMinutes < 60) {
            throw new CustomError(ERROR_MESSAGES.CANCEL_BOOKING_BEFORE_1_HOUR, HTTP_STATUS.BAD_REQUEST);
        }
        const transaction = await this._transactionRepository.findOne({
            referenceId: bookingId,
            source: "booking",
            status: "success",
        });
        if (!transaction) {
            throw new CustomError(ERROR_MESSAGES.TRANSACTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
        }
        await Promise.all([
            this._bookingRepository.update({ bookingId }, { status: "cancelled" }),
            this._walletRepository.incrementBalance(booking.clientId, booking.total),
            this._transactionRepository.save({
                transactionId: generateUniqueId("transaction"),
                userId: booking.clientId,
                amount: booking.total,
                type: "credit",
                source: "refund",
                status: "success",
                referenceId: bookingId,
            }),
        ]);
        await this._sendNotificationByUserUseCase.execute({
            receiverId: booking.shopId,
            message: `Booking cancelled for ${formatDate(booking.date.toString())} at ${booking.startTime}.`,
        });
        await this._sendNotificationByUserUseCase.execute({
            receiverId: booking.clientId,
            message: `Your booking is cancelled for ${formatDate(booking.date.toString())} at ${booking.startTime}.`,
        });
    }
};
CancelBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("IBarberRepository")),
    __param(2, inject("IWalletRepository")),
    __param(3, inject("ITransactionRepository")),
    __param(4, inject("ISendNotificationByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CancelBookingUseCase);
export { CancelBookingUseCase };
