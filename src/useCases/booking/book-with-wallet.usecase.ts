import { inject, injectable } from "tsyringe";
import { IBookWithWalletUseCase } from "../../entities/useCaseInterfaces/booking/book-with-wallet-usecase.interface.js";
import { IWalletRepository } from "../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface.js";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface.js";
import { ICreateWalletUseCase } from "../../entities/useCaseInterfaces/finance/wallet/create-wallet-usecase.interface.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { format, parse, parseISO, setHours, setMinutes } from "date-fns";
import { formatDate } from "../../shared/utils/date-formatter.js";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface.js";
import { fromZonedTime } from "date-fns-tz";

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
    // const bookingDateObj = parseISO(date);
    // console.log("Booking date", bookingDateObj, date);
    // const [time, modifier] = startTime.split(" ");
    // let [hours, minutes] = time.split(":").map(Number);
    // if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
    // if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
    // const bookingDateTime = setMinutes(
    //   setHours(bookingDateObj, hours),
    //   minutes
    // );

    // if (bookingDateTime.getTime() <= Date.now()) {
    //   throw new CustomError(
    //     ERROR_MESSAGES.YOU_CAN_ONLY_BOOK_FOR_FUTURE,
    //     HTTP_STATUS.BAD_REQUEST
    //   );
    // }
    console.log("Date", date, "startTime", startTime);
    const localDateStr = format(new Date(date), "yyyy-MM-dd");
    const localDateTimeString = `${localDateStr} ${startTime}`;

    const parsedLocal = parse(
      localDateTimeString,
      "yyyy-MM-dd hh:mm a",
      new Date()
    );

    const bookingDateTime = fromZonedTime(parsedLocal, "Asia/Kolkata");

    console.log(
      "ISO booking date",
      bookingDateTime,
      format(new Date(bookingDateTime), "yyyy-MM-dd hh:mm a")
    );

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
