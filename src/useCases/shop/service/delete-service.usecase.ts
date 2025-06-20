import { inject, injectable } from "tsyringe";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface";
import { IDeleteServiceUseCase } from "../../../entities/useCaseInterfaces/shop/service/delete-service-usecase.interface";

@injectable()
export class DeleteServiceUseCase implements IDeleteServiceUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository
	) {}
	async execute(serviceId: string, barberId: string): Promise<void> {
		await this._serviceRepository.delete({ serviceId, barberId });
	}
}
