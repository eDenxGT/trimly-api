import { model } from "mongoose";
import { walletSchema } from "../schemas/wallet.schema.js";
export const WalletModel = model("Wallet", walletSchema);
