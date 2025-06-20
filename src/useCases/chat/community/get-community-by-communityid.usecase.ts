import { inject, injectable } from "tsyringe";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import { IGetCommunityByCommunityIdUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-community-by-communityid-usecase.interface";

@injectable()
export class GetCommunityByCommunityIdUseCase implements IGetCommunityByCommunityIdUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}

  async execute(communityId: string): Promise<ICommunityChatRoomEntity | null> {
    return this._communityRepository.findOne({ communityId });
  }
}
