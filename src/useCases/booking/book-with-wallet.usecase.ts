import { inject, injectable } from "tsyringe";
import { IBookWithWalletUseCase } from "../../entities/useCaseInterfaces/booking/book-with-wallet-usecase.interface";
import { IWalletRepository } from "../../entities/repositoryInterfaces/finance/wallet-repository.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { ICreateWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { formatDate } from "../../shared/utils/date-formatter";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface";
import { getBookingDateTimeUTC } from "../../shared/utils/get-booking-date-time-utc.helper";

@injectable()
export class BookWithWalletUseCase implements IBookWithWalletUseCase {
  constructor(
    @inject("IWalletRepository") private _walletRepository: IWalletRepository,
    @inject("ICreateWalletUseCase")
    private _createWalletUseCase: ICreateWalletUseCase,
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository,
    @inject("ISendNotificationByUserUseCase")
    private _sendNotificationByUserUseCase: ISendNotificationByUserUseCase
  ) {}

  async execute({
    bookedTimeSlots,
    clientId,
    date,
    duration,
    services,
    shopId,
    startTime,
    total,
  }: {
    bookedTimeSlots: string[];
    clientId: string;
    date: string;
    duration: number;
    services: string[];
    shopId: string;
    startTime: string;
    total: number;
  }): Promise<void> {
    const bookingDateTime = getBookingDateTimeUTC(date, startTime);

    if (bookingDateTime.getTime() <= Date.now()) {
      throw new CustomError(
        ERROR_MESSAGES.YOU_CAN_ONLY_BOOK_FOR_FUTURE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const existingBooking = await this._bookingRepository.findOne({
      shopId,
      date,
      bookedTimeSlots: { $in: bookedTimeSlots },
      status: "confirmed",
    });
    if (existingBooking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_EXISTS,
        HTTP_STATUS.CONFLICT
      );
    }

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const cancelledBookings = await this._bookingRepository.find({
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

    const bookings = await this._bookingRepository.find({
      clientId,
      shopId,
      status: "confirmed",
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (bookings.length >= 3) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_LIMIT_EXCEEDED_FOR_TODAY,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const wallet = await this._walletRepository.findOne({ ownerId: clientId });
    if (!wallet) {
      await this._createWalletUseCase.execute({
        ownerId: clientId,
        ownerType: "client",
      });
      throw new CustomError(
        ERROR_MESSAGES.INSUFFICIENT_BALANCE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (wallet.balance < total) {
      throw new CustomError(
        ERROR_MESSAGES.INSUFFICIENT_BALANCE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const bookingId = generateUniqueId("booking");
    const transactionId = generateUniqueId("transaction");

    await this._bookingRepository.save({
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

    await this._walletRepository.decrementBalance(clientId, total);

    await this._transactionRepository.save({
      transactionId,
      userId: clientId,
      amount: total,
      type: "debit",
      source: "booking",
      status: "success",
      referenceId: bookingId,
    });

    await this._sendNotificationByUserUseCase.execute({
      receiverId: shopId,
      message: `📅 New booking scheduled for ${formatDate(
        bookingDateTime.toString()
      )} at ${startTime}.`,
    });

    await this._sendNotificationByUserUseCase.execute({
      receiverId: clientId,
      message: `Your booking is confirmed for ${formatDate(
        bookingDateTime.toString()
      )} at ${startTime} ✅`,
    });
  }
}
