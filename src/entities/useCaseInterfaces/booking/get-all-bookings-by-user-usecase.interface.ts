import { IBookingEntity } from "../../models/booking.entity";

export interface IGetAllBookingsByUserUseCase {
	execute(userId: string, role: string): Promise<IBookingEntity[]>;
}
