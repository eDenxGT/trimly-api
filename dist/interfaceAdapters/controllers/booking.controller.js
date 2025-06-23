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
exports.BookingController = void 0;
const tsyringe_1 = require("tsyringe");
const error_handler_1 = require("../../shared/utils/error.handler");
const constants_1 = require("../../shared/constants");
let BookingController = class BookingController {
    constructor(_getAllBookingsByIdUseCase, _createBookingUseCase, _verifyPaymentUseCase, _handleFailurePaymentUseCase, _getAllBookingsByUserUseCase, _cancelBookingUseCase, _completeBookingUseCase, _bookWithWalletUseCase) {
        this._getAllBookingsByIdUseCase = _getAllBookingsByIdUseCase;
        this._createBookingUseCase = _createBookingUseCase;
        this._verifyPaymentUseCase = _verifyPaymentUseCase;
        this._handleFailurePaymentUseCase = _handleFailurePaymentUseCase;
        this._getAllBookingsByUserUseCase = _getAllBookingsByUserUseCase;
        this._cancelBookingUseCase = _cancelBookingUseCase;
        this._completeBookingUseCase = _completeBookingUseCase;
        this._bookWithWalletUseCase = _bookWithWalletUseCase;
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Get All Bookings
    //* ─────────────────────────────────────────────────────────────
    getAllBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { shopId, type } = req.query;
                const { role, userId } = req.user;
                if ((type && type === "client") || type === "barber") {
                    const bookings = yield this._getAllBookingsByUserUseCase.execute(userId, role);
                    res.status(constants_1.HTTP_STATUS.OK).json({ success: true, bookings });
                    return;
                }
                const bookings = yield this._getAllBookingsByIdUseCase.execute(String(shopId), role);
                res.status(constants_1.HTTP_STATUS.OK).json({ success: true, bookings });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Create Booking
    //* ─────────────────────────────────────────────────────────────
    createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookedTimeSlots, clientId, date, duration, services, shopId, startTime, total, } = req.body;
                const bookingData = yield this._createBookingUseCase.execute({
                    bookedTimeSlots,
                    clientId,
                    date,
                    duration,
                    services,
                    shopId,
                    startTime,
                    total,
                });
                res.status(constants_1.HTTP_STATUS.OK).json(bookingData);
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Verify Payment
    //* ─────────────────────────────────────────────────────────────
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, } = req.body;
                yield this._verifyPaymentUseCase.execute(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId);
                res.status(constants_1.HTTP_STATUS.ACCEPTED).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PAYMENT_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Payment Failure
    //* ─────────────────────────────────────────────────────────────
    handlePaymentFailure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderId, status } = req.body;
                yield this._handleFailurePaymentUseCase.execute(orderId, status);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.PAYMENT_FAILED,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Cancel Booking
    //* ─────────────────────────────────────────────────────────────
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                yield this._cancelBookingUseCase.execute(String(bookingId));
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.CANCELLATION_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Booking Complete
    //* ─────────────────────────────────────────────────────────────
    updateBookingComplete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId } = req.body;
                const { role } = req.user;
                yield this._completeBookingUseCase.execute(String(bookingId), role);
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Wallet Payment
    //* ─────────────────────────────────────────────────────────────
    handleBookWithWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookedTimeSlots, clientId, date, duration, services, shopId, startTime, total, } = req.body;
                yield this._bookWithWalletUseCase.execute({
                    bookedTimeSlots,
                    clientId,
                    date,
                    duration,
                    services,
                    shopId,
                    startTime,
                    total,
                });
                res.status(constants_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: constants_1.SUCCESS_MESSAGES.WALLET_BOOKING_SUCCESS,
                });
            }
            catch (error) {
                (0, error_handler_1.handleErrorResponse)(req, res, error);
            }
        });
    }
};
exports.BookingController = BookingController;
exports.BookingController = BookingController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IGetAllBookingsByShopIdUseCase")),
    __param(1, (0, tsyringe_1.inject)("ICreateBookingUseCase")),
    __param(2, (0, tsyringe_1.inject)("IVerifyPaymentUseCase")),
    __param(3, (0, tsyringe_1.inject)("IHandleFailurePaymentUseCase")),
    __param(4, (0, tsyringe_1.inject)("IGetAllBookingsByUserUseCase")),
    __param(5, (0, tsyringe_1.inject)("ICancelBookingUseCase")),
    __param(6, (0, tsyringe_1.inject)("ICompleteBookingUseCase")),
    __param(7, (0, tsyringe_1.inject)("IBookWithWalletUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], BookingController);
