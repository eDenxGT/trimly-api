import { inject, injectable } from "tsyringe";
import { IBarberEntity } from "../../../entities/models/barber.entity";
import { IGetCommunityMembersUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-community-members-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";

@injectable()
export class GetCommunityMembersUseCase implements IGetCommunityMembersUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}

  async execute(communityId: string): Promise<Partial<IBarberEntity>[]> {
    const communityMembers =
      await this._communityRepository.findCommunityMembersByCommunityId(
        communityId
      );
    console.log(communityMembers);
    return communityMembers;
  }
}
