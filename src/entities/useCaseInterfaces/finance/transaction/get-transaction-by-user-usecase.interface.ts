import { ITransactionEntity } from "../../../models/transaction.entity";

export interface IGetTransactionByUserUseCase {
  execute(userId: string): Promise<ITransactionEntity[] | null>;
}
