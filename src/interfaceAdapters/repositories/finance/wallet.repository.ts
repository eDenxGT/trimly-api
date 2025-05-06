import { injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/finance/wallet-repository.interface.js";
import {
	IWalletModel,
	WalletModel,
} from "../../../frameworks/database/mongoDb/models/wallet.model.js";
import { BaseRepository } from "../base.repository.js";
import { IWalletEntity } from "../../../entities/models/wallet.entity.js";

@injectable()
export class WalletRepository
	extends BaseRepository<IWalletModel>
	implements IWalletRepository
{
	constructor() {
		super(WalletModel);
	}

	async incrementBalance(
		ownerId: string,
		amount: number
	): Promise<IWalletEntity | null> {
		return await this.model.findOneAndUpdate(
			{ ownerId },
			{ $inc: { balance: amount } },
			{ new: true }
		);
	}

	async decrementBalance(
		ownerId: string,
		amount: number
	): Promise<IWalletEntity | null> {
		return await this.model.findOneAndUpdate(
			{ ownerId },
			{ $inc: { balance: -amount } },
			{ new: true }
		);
	}
}
