import { IWithdrawalEntity } from "../../models/withdrawal.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IWithdrawalRepository
	extends IBaseRepository<IWithdrawalEntity> {
	findUserWithdrawals(
		filters: {
			status?: string;
			method?: string;
			search?: string;
		},
		pagination: {
			offset: number;
			limit: number;
		},
		sort: {
			field: string;
			direction: "asc" | "desc";
		}
	): Promise<{ withdrawals: any[]; total: number }>;
}
