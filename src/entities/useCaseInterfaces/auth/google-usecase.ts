import { TRole } from "../../../shared/constants";
import { IBarberEntity } from "../../models/barber.entity";
import { IClientEntity } from "../../models/client.entity";
import { IUserEntity } from "../../models/user.entity";

export interface IGoogleUseCase {
	execute(
		credential: string,
		client_id: string,
		role: TRole
	): Promise<Partial<IBarberEntity | IClientEntity>>;
}
