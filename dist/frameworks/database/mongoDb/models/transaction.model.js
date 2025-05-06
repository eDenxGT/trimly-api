import { model } from "mongoose";
import { transactionSchema } from "../schemas/transaction.schema.js";
export const TransactionModel = model("Transaction", transactionSchema);
