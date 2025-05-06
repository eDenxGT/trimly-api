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
import { setHours, setMinutes, parseISO } from "date-fns";
import { inject, injectable } from "tsyringe";
import { config } from "../../shared/config.js";
import Razorpay from "razorpay";
import { generateUniqueId } from "../../shared/utils/unique-uuid.helper.js";
import { CustomError } from "../../entities/utils/custom.error.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants.js";
let CreateBookingUseCase = class CreateBookingUseCase {
    _bookingRepository;
    _transactionRepository;
    constructor(_bookingRepository, _transactionRepository) {
        this._bookingRepository = _bookingRepository;
        this._transactionRepository = _transactionRepository;
    }
    async execute({ bookedTimeSlots, clientId, date, duration, services, shopId, startTime, total, }) {
        const bookingDateObj = parseISO(date);
        const [time, modifier] = startTime.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier.toLowerCase() === "pm" && hours < 12)
            hours += 12;
        if (modifier.toLowerCase() === "am" && hours === 12)
            hours = 0;
        const bookingDateTime = setMinutes(setHours(bookingDateObj, hours), minutes);
        if (bookingDateTime.getTime() <= Date.now()) {
            throw new CustomError(ERROR_MESSAGES.YOU_CAN_ONLY_BOOK_FOR_FUTURE, HTTP_STATUS.BAD_REQUEST);
        }
        const existingBooking = await this._bookingRepository.findOne({
            shopId,
            date,
            bookedTimeSlots: { $in: bookedTimeSlots },
            status: "confirmed",
        });
        if (existingBooking) {
            throw new CustomError(ERROR_MESSAGES.BOOKING_EXISTS, HTTP_STATUS.CONFLICT);
        }
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const cancelledBookings = await this._bookingRepository.find({
            clientId,
            status: "cancelled",
            createdAt: { $gte: twoDaysAgo },
        });
        if (cancelledBookings.length > 5) {
            // throw new CustomError(
            //   ERROR_MESSAGES.MORE_THAN_5_CANCELLED_BOOKING,
            //   HTTP_STATUS.BAD_REQUEST
            // );
        }
        const bookingId = generateUniqueId("booking");
        const transactionId = generateUniqueId("transaction");
        const razorpay = new Razorpay({
            key_id: config.payment.RAZORPAY_KEY_ID,
            key_secret: config.payment.RAZORPAY_SECRET,
        });
        const order = await razorpay.orders.create({
            amount: total * 100,
            currency: "INR",
            receipt: `receipt_${bookingId?.slice(0, 20)}`,
            notes: {
                bookingId: bookingId,
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
            amount: order.amount,
            currency: order.currency,
            bookingId,
        };
    }
};
CreateBookingUseCase = __decorate([
    injectable(),
    __param(0, inject("IBookingRepository")),
    __param(1, inject("ITransactionRepository")),
    __metadata("design:paramtypes", [Object, Object])
], CreateBookingUseCase);
export { CreateBookingUseCase };
