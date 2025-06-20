import { IServiceEntity } from "../../../models/service.enity";

export interface IUpdateServiceUseCase {
	execute(
		filter: Partial<IServiceEntity>,
		data: Partial<IServiceEntity>
	): Promise<IServiceEntity | null>;
}
