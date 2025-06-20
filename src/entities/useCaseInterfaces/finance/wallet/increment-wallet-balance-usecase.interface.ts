import { IWalletEntity } from "../../../models/wallet.entity";

export interface IIncrementWalletBalanceUseCase {
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
