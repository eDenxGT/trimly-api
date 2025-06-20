import { TRole } from "../../shared/constants";

export interface IRefreshTokenEntity {
   token: string;
   user: string;
   userType: TRole;
   expiresAt: Date;
   createdAt?: Date;
   updatedAt?: Date;
}