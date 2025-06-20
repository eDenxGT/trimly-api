import { IBarberDashboardResponse } from "../../../shared/dtos/dashboard-data.dto";

export interface IGetBarberDashboardDataUseCase {
  execute({ userId }: { userId: string }): Promise<IBarberDashboardResponse>;
}
