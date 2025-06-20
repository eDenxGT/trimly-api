import { injectable } from "tsyringe";
import {
  ITransactionModel,
  TransactionModel,
} from "../../../frameworks/database/mongoDb/models/transaction.model";
import { BaseRepository } from "../base.repository";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/finance/transaction-repository.interface";
import { FilterQuery } from "mongoose";

@injectable()
export class TransactionRepository
  extends BaseRepository<ITransactionModel>
  implements ITransactionRepository
{
  constructor() {
    super(TransactionModel);
  }
  async findSorted(
    filter: FilterQuery<ITransactionModel> = {},
    options: { sort?: any } = {}
  ): Promise<ITransactionModel[]> {
    return this.model.find(filter).sort(options.sort || {});
  }
}
