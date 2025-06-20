import { IServiceEntity } from "../../../models/service.enity";

export interface IAddServiceUseCase {
	execute(data: Partial<IServiceEntity>): Promise<void>;
}
