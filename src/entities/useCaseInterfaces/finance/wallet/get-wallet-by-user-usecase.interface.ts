import { IWalletEntity } from "../../../models/wallet.entity";

export interface IGetWalletByUserUseCase {
  execute(ownerId: string, role: "client" | "barber"): Promise<IWalletEntity>;
}
