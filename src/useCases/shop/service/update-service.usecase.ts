import { inject, injectable } from "tsyringe";
import { IServiceEntity } from "../../../entities/models/service.enity";
import { IServiceRepository } from "../../../entities/repositoryInterfaces/service/service-repository.interface";
import { IUpdateServiceUseCase } from "../../../entities/useCaseInterfaces/shop/service/update-service-usecase.interface";

@injectable()
export class UpdateServiceUseCase implements IUpdateServiceUseCase {
	constructor(
		@inject("IServiceRepository")
		private _serviceRepository: IServiceRepository
	) {}
	async execute(
		filter: Partial<IServiceEntity>,
		data: Partial<IServiceEntity>
	): Promise<IServiceEntity | null> {
		const service = await this._serviceRepository.update(filter, data);
		return service;
	}
}
