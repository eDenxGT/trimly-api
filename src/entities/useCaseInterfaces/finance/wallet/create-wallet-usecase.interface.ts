import { IWalletEntity } from "../../../models/wallet.entity";

export interface ICreateWalletUseCase {
	execute({
		ownerId,
		ownerType,
	}: {
		ownerId: string;
		ownerType: "client" | "barber";
	}): Promise<IWalletEntity | null>;
}
