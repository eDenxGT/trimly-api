import { inject, injectable } from "tsyringe";
import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IGetCommunityChatUseCase } from "../../../entities/useCaseInterfaces/chat/community/get-community-chat-usecase.interface";

@injectable()
export class GetCommunityChatUseCase implements IGetCommunityChatUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}

  async execute({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }): Promise<ICommunityChatRoomEntity | null> {
    const communityChat = this._communityRepository.getCommunityChat({
      userId,
      chatId,
    });
    if (!communityChat) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return communityChat;
  }
}
