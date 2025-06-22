import { inject, injectable } from "tsyringe";
import { IRemoveCommunityMemberUseCase } from "../../../entities/useCaseInterfaces/chat/community/remove-community-member-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";

@injectable()
export class RemoveCommunityMemberUseCase
  implements IRemoveCommunityMemberUseCase
{
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}

  async execute(communityId: string, userId: string): Promise<void> {
    await this._communityRepository.update(
      { communityId },
      { $pull: { members: userId } }
    );
  }
}
