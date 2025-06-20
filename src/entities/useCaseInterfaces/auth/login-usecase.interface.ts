import { LoginUserDTO } from "../../../shared/dtos/user.dto";
import { IAdminEntity } from "../../models/admin.entity";
import { IBarberEntity } from "../../models/barber.entity";
import { IClientEntity } from "../../models/client.entity";

export interface ILoginUserUseCase {
	execute(
		user: LoginUserDTO
	): Promise<Partial<IBarberEntity | IAdminEntity | IClientEntity>>;
}
