import { IAdminDashboardResponse } from "../../../shared/dtos/dashboard-data.dto";
import { IClientEntity } from "../../models/client.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IClientRepository extends IBaseRepository<IClientEntity> {
	updateWallet(userId: string, amount: number): Promise<void>;
	getRecentClients(): Promise<IAdminDashboardResponse["recentClients"]>
}
