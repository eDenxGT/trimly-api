import { inject, injectable } from "tsyringe";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IGetAllBookingsByShopIdUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-shopid-usecase.interface";

@injectable()
export class GetAllBookingsByShopIdUseCase implements IGetAllBookingsByShopIdUseCase {
	constructor(
		@inject("IBookingRepository")
		private _bookingRepository: IBookingRepository
	) {}

	async execute(shopId: string, role: string): Promise<IBookingEntity[]> {
		let filter;
		if (role === "client") {
			filter = { shopId, status: "confirmed" };
		} else {
			filter = { shopId };
		}
		const bookings = await this._bookingRepository.find(filter);
		return bookings;
	}
}
