import { IBookingEntity } from "../../models/booking.entity";

export interface IGetAllBookingsByShopIdUseCase {
	execute(shopId: string, role: string): Promise<IBookingEntity[]>;
}
