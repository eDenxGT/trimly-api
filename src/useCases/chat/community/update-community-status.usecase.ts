import { inject, injectable } from "tsyringe";
import { IUpdateCommunityStatusUseCase } from "../../../entities/useCaseInterfaces/chat/community/update-community-status-usecase.interface";
import { ICommunityRepository } from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class UpdateCommunityStatusUseCase
  implements IUpdateCommunityStatusUseCase
{
  constructor(
    @inject("ICommunityRepository")
    private _communityRepository: ICommunityRepository
  ) {}

  async execute(communityId: string): Promise<void> {
    const communityExists = await this._communityRepository.findOne({
      communityId,
    });
    if (!communityExists) {
      throw new CustomError(
        ERROR_MESSAGES.COMMUNITY_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    const status = communityExists.status === "active" ? "blocked" : "active";

    await this._communityRepository.update(
      {
        communityId,
      },
      { status }
    );
  }
}
