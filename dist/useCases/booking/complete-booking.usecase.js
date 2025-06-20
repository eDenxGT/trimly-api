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
exports.CompleteBookingUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const date_fns_1 = require("date-fns");
const custom_error_1 = require("../../entities/utils/custom.error");
const constants_1 = require("../../shared/constants");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
const date_formatter_1 = require("../../shared/utils/date-formatter");
const get_booking_date_time_utc_helper_1 = require("../../shared/utils/get-booking-date-time-utc.helper");
let CompleteBookingUseCase = class CompleteBookingUseCase {
    constructor(_bookingRepository, _transactionRepository, _incrementWalletBalanceUseCase, _sendNotificationByUserUseCase) {
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
        this._incrementWalletBalanceUseCase = _incrementWalletBalanceUseCase;
        this._sendNotificationByUserUseCase = _sendNotificationByUserUseCase;
    }
    execute(bookingId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            const bookingStartTime = (0, get_booking_date_time_utc_helper_1.getBookingDateTimeUTC)(booking.date, booking.startTime);
            const bookingEndTime = (0, date_fns_1.addMinutes)(bookingStartTime, booking.duration);
            const now = new Date();
            if (now < bookingEndTime) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_CANNOT_COMPLETE_BEFORE_TIME_ENDS, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const transaction = yield this._transactionRepository.findOne({
                referenceId: bookingId,
                source: "booking",
                status: "success",
            });
            if (!transaction) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.TRANSACTION_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            yield this._bookingRepository.update({ bookingId }, { status: "completed" });
            yield this._transactionRepository.save({
                transactionId: (0, unique_uuid_helper_1.generateUniqueId)("transaction"),
                userId: booking.shopId,
                amount: booking.total,
                type: "credit",
                source: "booking",
                status: "success",
                referenceId: bookingId,
            });
            yield this._incrementWalletBalanceUseCase.execute({
                ownerId: booking.shopId,
                amount: booking.total,
                role: role,
            });
            yield this._sendNotificationByUserUseCase.execute({
                receiverId: booking.shopId,
                message: `Booking completed for ${(0, date_formatter_1.formatDate)(booking.date.toString())} at ${booking.startTime}.`,
            });
            yield this._sendNotificationByUserUseCase.execute({
                receiverId: booking.clientId,
                message: `Your booking is completed for ${(0, date_formatter_1.formatDate)(booking.date.toString())} at ${booking.startTime}.`,
            });
        });
    }
};
exports.CompleteBookingUseCase = CompleteBookingUseCase;
exports.CompleteBookingUseCase = CompleteBookingUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(2, (0, tsyringe_1.inject)("IIncrementWalletBalanceUseCase")),
    __param(3, (0, tsyringe_1.inject)("ISendNotificationByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], CompleteBookingUseCase);
