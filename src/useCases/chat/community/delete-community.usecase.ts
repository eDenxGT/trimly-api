import { inject, injectable } from "tsyringe";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import { IDeleteCommunityUseCase } from "../../../entities/useCaseInterfaces/chat/community/delete-community-usecase.interface";
import { ICommunityMessageRepository } from "../../../entities/repositoryInterfaces/chat/community/community-message-respository.interface";

@injectable()
export class DeleteCommunityUseCase implements IDeleteCommunityUseCase {
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository,
    @inject("ICommunityMessageRepository")
    private _communityMessageRepository: ICommunityMessageRepository
  ) {}
  async execute(communityId: string): Promise<void> {
    await this._communityRepository.delete({ communityId });
    await this._communityMessageRepository.delete({ communityId });
  }
}
