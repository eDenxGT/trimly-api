import { statusTypes, TRole } from "../../shared/constants";

export interface IUserEntity {
	userId?: string;
	fullName: string;
	email: string;
	role?: TRole;
	password: string;
	avatar?: string;
	phoneNumber: string;
	status?: statusTypes;
	createdAt?: Date;
	updatedAt?: Date;
}
