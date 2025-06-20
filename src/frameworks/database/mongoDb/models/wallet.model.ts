import { Document, model, ObjectId } from "mongoose";
import { walletSchema } from "../schemas/wallet.schema";
import { IWalletEntity } from "../../../../entities/models/wallet.entity";

export interface IWalletModel extends IWalletEntity, Document {
   _id: ObjectId;
}

export const WalletModel = model<IWalletModel>("Wallet", walletSchema);
