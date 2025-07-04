import { inject, injectable } from "tsyringe";
import { IGetAllBookingsByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-user-usecase.interface";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";

@injectable()
export class GetAllBookingsByUserUseCase
	implements IGetAllBookingsByUserUseCase
{
	constructor(
		@inject("IBookingRepository")
		private _bookingRepository: IBookingRepository,
	) {}
	async execute(userId: string, role: string): Promise<IBookingEntity[]> {
		let bookings = [] as IBookingEntity[];
		if (role === "barber") {
			bookings =
				await this._bookingRepository.findBookingsWithDetailsForBarber(
					userId
				);
		}

		if (role === "client") {
			bookings =
				await this._bookingRepository.findBookingsWithDetailsForClient(
					userId
				);
		}
		return bookings;
	}
}
