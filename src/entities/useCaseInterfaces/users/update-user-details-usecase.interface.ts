import { IAdminEntity } from "../../models/admin.entity";
import { IBarberEntity } from "../../models/barber.entity";
import { IClientEntity } from "../../models/client.entity";

export interface IUpdateUserDetailsUseCase {
	execute(
		userId: string,
		role: string,
		userDetails: Record<string, any>
	): Promise<IAdminEntity | IClientEntity | IBarberEntity | null>;
}
