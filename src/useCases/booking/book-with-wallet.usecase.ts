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
import { ICheckBookingEligibilityUseCase } from "../../entities/useCaseInterfaces/booking/checking-booking-eligibility-usecase.interface";

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
    private _sendNotificationByUserUseCase: ISendNotificationByUserUseCase,
    @inject("ICheckBookingEligibilityUseCase")
    private _checkBookingEligibilityUseCase: ICheckBookingEligibilityUseCase
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
    const { bookingDateTime } =
      await this._checkBookingEligibilityUseCase.execute({
        bookedTimeSlots,
        clientId,
        date,
        duration,
        services,
        shopId,
        startTime,
        total,
      });

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
