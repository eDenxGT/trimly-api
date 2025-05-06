import { model } from "mongoose";
import { withdrawalSchema } from "../schemas/withdrawal.schema.js";
export const WithdrawalModel = model("Withdrawal", withdrawalSchema);
