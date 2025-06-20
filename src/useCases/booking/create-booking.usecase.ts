import { inject, injectable } from "tsyringe";
import { ICreateBookingUseCase } from "../../entities/useCaseInterfaces/booking/create-booking-usecase.interface";
import { IBookingRepository } from "./../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { config } from "../../shared/config";
import Razorpay from "razorpay";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { ICheckBookingEligibilityUseCase } from "../../entities/useCaseInterfaces/booking/checking-booking-eligibility-usecase.interface";

@injectable()
export class CreateBookingUseCase implements ICreateBookingUseCase {
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository,
    @inject("ITransactionRepository")
    private _transactionRepository: ITransactionRepository,
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
  }): Promise<{
    id: string;
    amount: number;
    currency: string;
    bookingId: string;
  }> {
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

    const bookingId = generateUniqueId("booking");
    const transactionId = generateUniqueId("transaction");

    const razorpay = new Razorpay({
      key_id: config.payment.RAZORPAY_KEY_ID!,
      key_secret: config.payment.RAZORPAY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: `receipt_${bookingId?.slice(0, 20)}`,
      notes: {
        bookingId: bookingId as string,
      },
    });

    await this._bookingRepository.save({
      bookedTimeSlots,
      bookingId,
      clientId,
      orderId: order.id,
      date: bookingDateTime,
      duration,
      services,
      shopId,
      startTime,
      total,
    });

    await this._transactionRepository.save({
      transactionId,
      userId: clientId,
      amount: total,
      type: "debit",
      source: "booking",
      status: "pending",
      referenceId: bookingId,
    });

    return {
      id: order.id,
      amount: order.amount as number,
      currency: order.currency,
      bookingId,
    };
  }
}
