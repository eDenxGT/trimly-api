import { ICommunityChatRoomEntity } from "../../../entities/models/chat/community-chat-room.entity";
import { IEditCommunityUseCase } from "../../../entities/useCaseInterfaces/chat/community/edit-community-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import { inject, injectable } from "tsyringe";

@injectable()
export class EditCommunityUseCase implements IEditCommunityUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}
  async execute(data: Partial<ICommunityChatRoomEntity>): Promise<void> {
    await this._communityRepository.update(
      { communityId: data.communityId },
      {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      }
    );
  }
}
