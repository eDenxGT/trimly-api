import { IBarberEntity } from "../../../models/barber.entity";

export interface IGetCommunityMembersUseCase {
  execute(communityId: string): Promise<Partial<IBarberEntity>[]>;
}
