import { UserDTO } from "../../../shared/dtos/user.dto";
import { IBarberEntity } from "../../models/barber.entity";
import { IClientEntity } from "../../models/client.entity";

export interface IRegisterUserUseCase {
	execute(
		user: UserDTO,
	): Promise<IBarberEntity | IClientEntity | null>;
}
