import { model } from "mongoose";
import { bookingSchema } from "../schemas/booking.schema.js";
export const BookingModel = model("Booking", bookingSchema);
