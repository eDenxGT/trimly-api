import { inject, injectable } from "tsyringe";
import { IGetAllBookingsByUserUseCase } from "../../entities/useCaseInterfaces/booking/get-all-bookings-by-user-usecase.interface";
import { IBookingEntity } from "../../entities/models/booking.entity";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface";
import { IServiceRepository } from "../../entities/repositoryInterfaces/service/service-repository.interface";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";

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
