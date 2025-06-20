import { inject, injectable } from "tsyringe";
import { IHandleFailurePaymentUseCase } from "../../entities/useCaseInterfaces/booking/handle-failure-payment-usecase.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { ISendNotificationByUserUseCase } from "../../entities/useCaseInterfaces/notifications/send-notification-by-user-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { formatDate } from "../../shared/utils/date-formatter";

@injectable()
export class HandleFailurePaymentUseCase
  implements IHandleFailurePaymentUseCase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository,
    @inject("ISendNotificationByUserUseCase")
    private _sendNotificationByUserUseCase: ISendNotificationByUserUseCase,
  ) {}
  async execute(orderId: string, status: "cancelled"): Promise<void> {
    const booking = await this._bookingRepository.update(
      { orderId },
      { status }
    );
    if (!booking) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    await this._transactionRepository.update(
      {
        referenceId: booking?.bookingId,
        source: "booking",
      },
      {
        status: "failed",
      }
    );

    await this._sendNotificationByUserUseCase.execute({
      receiverId: booking.clientId,
      message: `Your booking is cancelled for ${formatDate(
        booking.date.toString()
      )} at ${booking.startTime} due to failed payment.`,
    });
  }
}
