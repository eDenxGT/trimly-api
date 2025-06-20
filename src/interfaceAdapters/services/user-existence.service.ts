import { inject, injectable } from "tsyringe";
import { IClientRepository } from "../../entities/repositoryInterfaces/users/client-repository.interface";
import { IUserExistenceService } from "../../entities/serviceInterfaces/user-existence-service.interface";
import { IBarberRepository } from "../../entities/repositoryInterfaces/users/barber-repository.interface";
import { IAdminRepository } from "../../entities/repositoryInterfaces/users/admin-repository.interface";

@injectable()
export class UserExistenceService implements IUserExistenceService {
	constructor(
		@inject("IBarberRepository")
		private _barberRepository: IBarberRepository,
		@inject("IClientRepository")
		private _clientRepository: IClientRepository,
		@inject("IAdminRepository") private _adminRepository: IAdminRepository
	) {}

	async emailExists(email: string): Promise<boolean> {
		const [barber, client, admin] = await Promise.all([
			this._barberRepository.findOne({ email }),
			this._clientRepository.findOne({ email }),
			this._adminRepository.findOne({ email }),
		]);

		return Boolean(barber || client || admin);
	}
}
