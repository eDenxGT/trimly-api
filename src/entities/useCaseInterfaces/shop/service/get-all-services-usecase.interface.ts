import { IServiceEntity } from "../../../models/service.enity";


export interface IGetAllServicesUseCase {
	execute(filter: Partial<IServiceEntity>): Promise<IServiceEntity[] | null>;
}
