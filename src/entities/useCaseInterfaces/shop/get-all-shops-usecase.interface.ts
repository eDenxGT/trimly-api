import { IPaginatedShops } from "../../models/paginated/paginated-shops.entity";

export interface IGetAllShopsUseCase {
	execute(
		forType: string,
		pageNumber: number,
		pageSize: number,
		searchTerm: string
	): Promise<IPaginatedShops>;
}
