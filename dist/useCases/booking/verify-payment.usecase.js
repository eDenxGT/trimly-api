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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyPaymentUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../../shared/config");
const custom_error_1 = require("../../entities/utils/custom.error");
const constants_1 = require("../../shared/constants");
const date_formatter_1 = require("../../shared/utils/date-formatter");
let VerifyPaymentUseCase = class VerifyPaymentUseCase {
    constructor(_bookingRepository, _transactionRepository, _sendNotificationByUserUseCase) {
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
        this._sendNotificationByUserUseCase = _sendNotificationByUserUseCase;
    }
    execute(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = config_1.config.payment.RAZORPAY_SECRET;
            const body = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto_1.default
                .createHmac("sha256", secret)
                .update(body.toString())
                .digest("hex");
            if (expectedSignature !== razorpay_signature) {
                throw new custom_error_1.CustomError("Invalid signature. Payment verification failed.", constants_1.HTTP_STATUS.BAD_REQUEST);
            }
            yield this._bookingRepository.update({ bookingId }, { status: "confirmed" });
            yield this._transactionRepository.update({ referenceId: bookingId, source: "booking" }, { status: "success" });
            const booking = yield this._bookingRepository.findOne({ bookingId });
            if (!booking) {
                throw new custom_error_1.CustomError(constants_1.ERROR_MESSAGES.BOOKING_NOT_FOUND, constants_1.HTTP_STATUS.NOT_FOUND);
            }
            yield this._sendNotificationByUserUseCase.execute({
                receiverId: booking.shopId,
                message: `📅 New booking scheduled for ${(0, date_formatter_1.formatDate)(booking.date.toString())} at ${booking.startTime}.`,
            });
            yield this._sendNotificationByUserUseCase.execute({
                receiverId: booking.clientId,
                message: `Your booking is confirmed for ${(0, date_formatter_1.formatDate)(booking.date.toString())} at ${booking.startTime} ✅`,
            });
        });
    }
};
exports.VerifyPaymentUseCase = VerifyPaymentUseCase;
exports.VerifyPaymentUseCase = VerifyPaymentUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IBookingRepository")),
    __param(1, (0, tsyringe_1.inject)("ITransactionRepository")),
    __param(2, (0, tsyringe_1.inject)("ISendNotificationByUserUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object])
], VerifyPaymentUseCase);
