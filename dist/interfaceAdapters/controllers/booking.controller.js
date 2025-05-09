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
import { handleErrorResponse } from "../../shared/utils/error.handler.js";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants.js";
let BookingController = class BookingController {
    _getAllBookingsByIdUseCase;
    _createBookingUseCase;
    _verifyPaymentUseCase;
    _handleFailurePaymentUseCase;
    _getAllBookingsByUserUseCase;
    _cancelBookingUseCase;
    _completeBookingUseCase;
    _bookWithWalletUseCase;
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
    async getAllBookings(req, res) {
        try {
            const { shopId, type } = req.query;
            const { role, userId } = req.user;
            if ((type && type === "client") || type === "barber") {
                const bookings = await this._getAllBookingsByUserUseCase.execute(userId, role);
                res.status(HTTP_STATUS.OK).json({ success: true, bookings });
                return;
            }
            const bookings = await this._getAllBookingsByIdUseCase.execute(String(shopId), role);
            res.status(HTTP_STATUS.OK).json({ success: true, bookings });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Create Booking
    //* ─────────────────────────────────────────────────────────────
    async createBooking(req, res) {
        try {
            const { bookedTimeSlots, clientId, date, duration, services, shopId, startTime, total, } = req.body;
            const bookingData = await this._createBookingUseCase.execute({
                bookedTimeSlots,
                clientId,
                date,
                duration,
                services,
                shopId,
                startTime,
                total,
            });
            res.status(HTTP_STATUS.OK).json(bookingData);
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                    🛠️ Verify Payment
    //* ─────────────────────────────────────────────────────────────
    async verifyPayment(req, res) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, } = req.body;
            await this._verifyPaymentUseCase.execute(razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId);
            res.status(HTTP_STATUS.ACCEPTED).json({
                success: true,
                message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Payment Failure
    //* ─────────────────────────────────────────────────────────────
    async handlePaymentFailure(req, res) {
        try {
            const { orderId, status } = req.body;
            await this._handleFailurePaymentUseCase.execute(orderId, status);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PAYMENT_FAILED,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Cancel Booking
    //* ─────────────────────────────────────────────────────────────
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.body;
            await this._cancelBookingUseCase.execute(String(bookingId));
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CANCELLATION_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Booking Complete
    //* ─────────────────────────────────────────────────────────────
    async updateBookingComplete(req, res) {
        try {
            const { bookingId } = req.body;
            const { role } = req.user;
            await this._completeBookingUseCase.execute(String(bookingId), role);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
    //* ─────────────────────────────────────────────────────────────
    //*                 🛠️  Handle Wallet Payment
    //* ─────────────────────────────────────────────────────────────
    async handleBookWithWallet(req, res) {
        try {
            const { bookedTimeSlots, clientId, date, duration, services, shopId, startTime, total, } = req.body;
            await this._bookWithWalletUseCase.execute({
                bookedTimeSlots,
                clientId,
                date,
                duration,
                services,
                shopId,
                startTime,
                total,
            });
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.WALLET_BOOKING_SUCCESS,
            });
        }
        catch (error) {
            handleErrorResponse(req, res, error);
        }
    }
};
BookingController = __decorate([
    injectable(),
    __param(0, inject("IGetAllBookingsByShopIdUseCase")),
    __param(1, inject("ICreateBookingUseCase")),
    __param(2, inject("IVerifyPaymentUseCase")),
    __param(3, inject("IHandleFailurePaymentUseCase")),
    __param(4, inject("IGetAllBookingsByUserUseCase")),
    __param(5, inject("ICancelBookingUseCase")),
    __param(6, inject("ICompleteBookingUseCase")),
    __param(7, inject("IBookWithWalletUseCase")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object])
], BookingController);
export { BookingController };
