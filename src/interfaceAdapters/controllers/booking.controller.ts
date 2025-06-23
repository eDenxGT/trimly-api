import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import { IBookingController } from "../../entities/controllerInterfaces/booking/booking-controller.interface";
import { handleErrorResponse } from "../../shared/utils/error.handler";
import { CustomRequest } from "../middlewares/auth.middleware";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { ICreateBookingUseCase } from "../../entities/useCaseInterfaces/booking/create-booking-usecase.interface";
import { IVerifyPaymentUseCase } from "../../entities/useCaseInterfaces/booking/verify-payment-usecase.interface";
import { IHandleFailurePaymentUseCase } from "../../entities/useCaseInterfaces/booking/handle-failure-payment-usecase.interface";
import { IGetAllBookingsByShopIdUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-shopid-usecase.interface";
import { IGetAllBookingsByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-user-usecase.interface";
import { ICancelBookingUseCase } from "../../entities/useCaseInterfaces/booking/cancel-booking-usecase.interface";
import { ICompleteBookingUseCase } from "../../entities/useCaseInterfaces/booking/complete-booking-usecase.interface";
import { IBookWithWalletUseCase } from "../../entities/useCaseInterfaces/booking/book-with-wallet-usecase.interface";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject("IGetAllBookingsByShopIdUseCase")
    private _getAllBookingsByIdUseCase: IGetAllBookingsByShopIdUseCase,
    @inject("ICreateBookingUseCase")
    private _createBookingUseCase: ICreateBookingUseCase,
    @inject("IVerifyPaymentUseCase")
    private _verifyPaymentUseCase: IVerifyPaymentUseCase,
    @inject("IHandleFailurePaymentUseCase")
    private _handleFailurePaymentUseCase: IHandleFailurePaymentUseCase,
    @inject("IGetAllBookingsByUserUseCase")
    private _getAllBookingsByUserUseCase: IGetAllBookingsByUserUseCase,
    @inject("ICancelBookingUseCase")
    private _cancelBookingUseCase: ICancelBookingUseCase,
    @inject("ICompleteBookingUseCase")
    private _completeBookingUseCase: ICompleteBookingUseCase,
    @inject("IBookWithWalletUseCase")
    private _bookWithWalletUseCase: IBookWithWalletUseCase
  ) {}

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️ Get All Bookings
  //* ─────────────────────────────────────────────────────────────
  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const { shopId, type } = req.query;
      const { role, userId } = (req as CustomRequest).user;

      if ((type && type === "client") || type === "barber") {
        const bookings = await this._getAllBookingsByUserUseCase.execute(
          userId,
          role
        );

        res.status(HTTP_STATUS.OK).json({ success: true, bookings });
        return;
      }

      const bookings = await this._getAllBookingsByIdUseCase.execute(
        String(shopId),
        role
      );
      res.status(HTTP_STATUS.OK).json({ success: true, bookings });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️ Create Booking
  //* ─────────────────────────────────────────────────────────────
  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const {
        bookedTimeSlots,
        clientId,
        date,
        duration,
        services,
        shopId,
        startTime,
        total,
      } = req.body;

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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                    🛠️ Verify Payment
  //* ─────────────────────────────────────────────────────────────
  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId,
      } = req.body;

      await this._verifyPaymentUseCase.execute(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId
      );

      res.status(HTTP_STATUS.ACCEPTED).json({
        success: true,
        message: SUCCESS_MESSAGES.PAYMENT_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                 🛠️  Handle Payment Failure
  //* ─────────────────────────────────────────────────────────────
  async handlePaymentFailure(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, status } = req.body;

      await this._handleFailurePaymentUseCase.execute(orderId, status);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PAYMENT_FAILED,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                 🛠️  Handle Cancel Booking
  //* ─────────────────────────────────────────────────────────────
  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.body;

      await this._cancelBookingUseCase.execute(String(bookingId));

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.CANCELLATION_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                 🛠️  Handle Booking Complete
  //* ─────────────────────────────────────────────────────────────
  async updateBookingComplete(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.body;
      const { role } = (req as CustomRequest).user;

      await this._completeBookingUseCase.execute(String(bookingId), role);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
      });
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }

  //* ─────────────────────────────────────────────────────────────
  //*                 🛠️  Handle Wallet Payment
  //* ─────────────────────────────────────────────────────────────
  async handleBookWithWallet(req: Request, res: Response): Promise<void> {
    try {
      const {
        bookedTimeSlots,
        clientId,
        date,
        duration,
        services,
        shopId,
        startTime,
        total,
      } = req.body;

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
    } catch (error) {
      handleErrorResponse(req, res, error);
    }
  }
}
