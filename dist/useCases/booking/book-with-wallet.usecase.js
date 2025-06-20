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
exports.BookWithWalletUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const custom_error_1 = require("../../entities/utils/custom.error");
const constants_1 = require("../../shared/constants");
const unique_uuid_helper_1 = require("../../shared/utils/unique-uuid.helper");
const date_formatter_1 = require("../../shared/utils/date-formatter");
const get_booking_date_time_utc_helper_1 = require("../../shared/utils/get-booking-date-time-utc.helper");
let BookWithWalletUseCase = class BookWithWalletUseCase {
    constructor(_walletRepository, _createWalletUseCase, _bookingRepository, _transactionRepository, _sendNotificationByUserUseCase) {
        this._walletRepository = _walletRepository;
        this._createWalletUseCase = _createWalletUseCase;
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
        this._sendNotificationByUserUseCase = _sendNotificationByUserUseCase;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ bookedTimeSlots, clientId, date, duration, services, shopId, startTime, total, }) {
            const bookingDateTime = (0, get_booking_date_time_utc_helper_1.getBookingDateTimeUTC)(date, startTime);
            if (bookingDateTime.getTime() <= Date.now()) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.YOU_CAN_ONLY_BOOK_FOR_FUTURE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const existingBooking = yield this._bookingRepository.findOne({
                shopId,
                date,
                bookedTimeSlots: { $in: bookedTimeSlots },
                status: "confirmed",
            });
            if (existingBooking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_EXISTS, constants_1.HTTP_STATUS.CONFLICT);
            }
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            const cancelledBookings = yield this._bookingRepository.find({
                clientId,
                status: "cancelled",
                createdAt: { $gte: twoDaysAgo },
            });
            if (cancelledBookings.length > 5) {
                // throw new CustomError(ERROR_MESSAGES.MORE_THAN_5_CANCELLED_BOOKING, HTTP_STATUS.BAD_REQUEST);
            }
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const bookings = yield this._bookingRepository.find({
                clientId,
                shopId,
                status: "confirmed",
                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            });
            if (bookings.length >= 3) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_LIMIT_EXCEEDED_FOR_TODAY, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const wallet = yield this._walletRepository.findOne({ ownerId: clientId });
            if (!wallet) {
                yield this._createWalletUseCase.execute({
                    ownerId: clientId,
                    ownerType: "client",
                });
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INSUFFICIENT_BALANCE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            if (wallet.balance < total) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.INSUFFICIENT_BALANCE, constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            const bookingId = (0, unique_uuid_helper_1.generateUniqueId)("booking");
            const transactionId = (0, unique_uuid_helper_1.generateUniqueId)("transaction");
            yield this._bookingRepository.save({
                bookedTimeSlots,
                bookingId,
                clientId,
                date: bookingDateTime,
                duration,
                services,
                shopId,
                status: "confirmed",
                startTime,
                total,
            });
            yield this._walletRepository.decrementBalance(clientId, total);
            yield this._transactionRepository.save({
                transactionId,
                userId: clientId,
                amount: total,
                type: "debit",
                source: "booking",
                status: "success",
                referenceId: bookingId,
            });
            yield this._sendNotificationByUserUseCase.execute({
                receiverId: shopId,
                message: `📅 New booking scheduled for ${(0, date_formatter_1.formatDate)(bookingDateTime.toString())} at ${startTime}.`,
            });
            yield this._sendNotificationByUserUseCase.execute({
                receiverId: clientId,
                message: `Your booking is confirmed for ${(0, date_formatter_1.formatDate)(bookingDateTime.toString())} at ${startTime} ✅`,
            });
        });
    }
};
exports.BookWithWalletUseCase = BookWithWalletUseCase;
exports.BookWithWalletUseCase = BookWithWalletUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IWalletRepository")),
    __param(1, (0, tsyringe_1.inject)("ICreateWalletUseCase")),
    __param(2, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(3, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(4, (0, tsyringe_1.inject)("ISendNotificationByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], BookWithWalletUseCase);
