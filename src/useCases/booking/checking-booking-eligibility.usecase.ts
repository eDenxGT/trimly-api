import { parse, isValid, format } from "date-fns";
import { inject, injectable } from "tsyringe";
import { ICheckBookingEligibilityUseCase } from "../../entities/useCaseInterfaces/booking/checking-booking-eligibility-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import {
  getBookingDateTimeUTC,
  getExactUTC,
} from "../../shared/utils/get-booking-date-time-utc.helper";

@injectable()
export class CheckBookingEligibilityUseCase
  implements ICheckBookingEligibilityUseCase
{
  constructor(
    @inject("IBookingRepository")
    private _bookingRepository: IBookingRepository
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
  }): Promise<{ bookingDateTime: Date }> {
    // const bookingDateTime = getExactUTC(date);
    // const bookingDateTime = getBookingDateTimeUTC(date, startTime);
    const bookingDateTime = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
    if (parse(startTime, "hh:mm a", new Date()).getTime() <= new Date().getTime()) {
      throw new CustomError(
        ERROR_MESSAGES.YOU_CAN_ONLY_BOOK_FOR_FUTURE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const startOfDayOfBookingDate = new Date(date);
    startOfDayOfBookingDate.setUTCHours(0, 0, 0, 0);

    const endOfDayOfBookingDate = new Date(date);
    endOfDayOfBookingDate.setUTCHours(23, 59, 59, 999);

    const existingBooking = await this._bookingRepository.findOne({
      shopId,
      date: { $gte: startOfDayOfBookingDate, $lte: endOfDayOfBookingDate },
      bookedTimeSlots: { $in: bookedTimeSlots },
      status: { $in: ["confirmed", "pending"] },
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
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookings = await this._bookingRepository.find({
      clientId,
      shopId,
      status: "confirmed",
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (bookings.length >= 5) {
      throw new CustomError(
        ERROR_MESSAGES.BOOKING_LIMIT_EXCEEDED_FOR_TODAY,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    return { bookingDateTime };
  }
}
