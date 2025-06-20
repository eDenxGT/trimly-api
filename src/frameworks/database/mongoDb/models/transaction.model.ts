import { Document, model, ObjectId } from "mongoose";
import { ITransactionEntity } from "../../../../entities/models/transaction.entity";
import { transactionSchema } from "../schemas/transaction.schema";

export interface ITransactionModel extends ITransactionEntity, Document {
  _id: ObjectId;
}

export const TransactionModel = model<ITransactionModel>(
  "Transaction",
  transactionSchema
);
