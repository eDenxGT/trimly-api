import { IWalletEntity } from "../../models/wallet.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface IWalletRepository extends IBaseRepository<IWalletEntity> {
	incrementBalance(
		ownerId: string,
		amount: number
	): Promise<IWalletEntity | null>;
	decrementBalance(
		ownerId: string,
		amount: number
	): Promise<IWalletEntity | null>;
}
