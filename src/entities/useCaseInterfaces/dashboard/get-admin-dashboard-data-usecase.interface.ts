import { IAdminDashboardResponse } from "../../../shared/dtos/dashboard-data.dto";

export interface IGetAdminDashboardDataUseCase {
  execute(): Promise<IAdminDashboardResponse>;
}
