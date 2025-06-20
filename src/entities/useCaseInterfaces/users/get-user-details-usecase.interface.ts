import { TRole } from "../../../shared/constants";
import { UserDTO } from "../../../shared/dtos/user.dto";
import { IAdminEntity } from "../../models/admin.entity";
import { IBarberEntity } from "../../models/barber.entity";
import { IClientEntity } from "../../models/client.entity";

export interface IGetUserDetailsUseCase {
	execute(
		userId: string,
		role: TRole
	): Promise<IBarberEntity | IAdminEntity | IClientEntity>;
}
