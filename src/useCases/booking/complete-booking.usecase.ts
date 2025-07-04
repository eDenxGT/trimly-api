import { inject, injectable } from "tsyringe";
import { parse, format, addMinutes } from "date-fns";
import { CustomError } from "../../entities/utils/custom.error";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { ICompleteBookingUseCase } from "../../entities/useCaseInterfaces/booking/complete-booking-usecase.interface";
import { IIncrementWalletBalanceUseCase } from "../../entities/useCaseInterfaces/finance/wallet/increment-wallet-balance-usecase.interface";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface";
import { formatDate } from "../../shared/utils/date-formatter";
import { getBookingDateTimeUTC } from "../../shared/utils/get-booking-date-time-utc.helper";

@injectable()
export class CompleteBookingUseCase implements ICompleteBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository,
    @inject("IIncrementWalletBalanceUseCase")
    private _incrementWalletBalanceUseCase: IIncrementWalletBalanceUseCase,
    @inject("ISendNotificationByUserUseCase")
    private _sendNotificationByUserUseCase: ISendNotificationByUserUseCase
  ) {}

  async execute(bookingId: string, role: string): Promise<void> {
    const booking = await this._bookingRepository.findOne({ bookingId });
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    const bookingStartTime = getBookingDateTimeUTC(
      booking.date,
      booking.startTime
    );

    const bookingEndTime = addMinutes(bookingStartTime, booking.duration);

    const now = new Date();

    if (now < bookingEndTime) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_CANNOT_COMPLETE_BEFORE_TIME_ENDS,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const transaction = await this._transactionRepository.findOne({
      referenceId: bookingId,
      source: "booking",
      status: "success",
    });

    if (!transaction) {
      throw new CustomError(
        ERROR_MESSAGES.TRANSACTION_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    await this._bookingRepository.update(
      { bookingId },
      { status: "completed" }
    );

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
      role: role as "barber" | "client",
    });

    await this._sendNotificationByUserUseCase.execute({
      receiverId: booking.shopId,
      message: `Booking completed for ${formatDate(
        booking.date.toString()
      )} at ${booking.startTime}.`,
    });

    await this._sendNotificationByUserUseCase.execute({
      receiverId: booking.clientId,
      message: `Your booking is completed for ${formatDate(
        booking.date.toString()
      )} at ${booking.startTime}.`,
    });
  }
}
