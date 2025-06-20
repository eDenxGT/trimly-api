import { IWithdrawalEntity } from "../../../models/withdrawal.entity";

export interface IGetWithdrawalByUserUseCase {
  execute(userId: string): Promise<IWithdrawalEntity[] | null>;
}
