import { inject, injectable } from "tsyringe";
import { IGetCommunityForEditUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-community-for-edit-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class GetCommunityForEditUseCase implements IGetCommunityForEditUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}
  async execute(communityId: string): Promise<ICommunityChatRoomEntity> {
    const community = await this._communityRepository.findOne({ communityId });
    
    if (!community) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return community;
  }
}
