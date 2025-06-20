import { IBarberEntity } from "../barber.entity";

export interface IPaginatedShops {
	shops: IBarberEntity[] | [];
	total: number;
}
