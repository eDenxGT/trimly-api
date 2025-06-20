import { IWalletEntity } from "../../../models/wallet.entity";

export interface IDecrementWalletBalanceUseCase {
	execute({
		ownerId,
		amount,
		role,
	}: {
		ownerId: string;
		amount: number;
		role: "client" | "barber";
	}): Promise<IWalletEntity>;
}
