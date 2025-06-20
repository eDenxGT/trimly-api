import { IBarberEntity } from "../../models/barber.entity";

export interface IGetShopDetailsByShopIdUseCase {
	execute(shopId: string, forType: string): Promise<IBarberEntity | null>;
}
