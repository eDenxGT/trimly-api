import { IPaginatedUsers } from "../../models/paginated/paginated-users.entity";

export interface IGetAllUsersUseCase {
	execute(
		userType: string,
		pageNumber: number,
		pageSize: number,
		searchTerm: string
	): Promise<IPaginatedUsers>;
}
