import { inject, injectable } from "tsyringe";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity";
import { IGetAllCommunitiesForAdminUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-all-communities-for-admin-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";

@injectable()
export class GetAllCommunitiesForAdminUseCase
  implements IGetAllCommunitiesForAdminUseCase
{
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}
  async execute({
    search,
    page,
    limit,
  }: {
    search: string;
    page: number;
    limit: number;
  }): Promise<{
    communities: ICommunityChatRoomEntity[];
    totalPages: number;
    currentPage: number;
  }> {
    const communityData =
      await this._communityRepository.findAllCommunitiesForListing({
        filter: {},
        search,
        page,
        limit,
      });

    return {
      communities: communityData.communities,
      totalPages: communityData.totalPages,
      currentPage: page,
    };
  }
}
