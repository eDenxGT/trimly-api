import { IBarberEntity } from "../barber.entity";
import { IClientEntity } from "../client.entity";

export interface IPaginatedUsers {
	users: IClientEntity[] | IBarberEntity[] | [];
	total: number;
}
