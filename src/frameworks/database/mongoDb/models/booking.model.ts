import { Document, model, ObjectId } from "mongoose";
import { IBookingEntity } from "../../../../entities/models/booking.entity";
import { bookingSchema } from "../schemas/booking.schema";

export interface IBookingModel extends IBookingEntity, Document {
	_id: ObjectId;
}

export const BookingModel = model<IBookingModel>("Booking", bookingSchema);
