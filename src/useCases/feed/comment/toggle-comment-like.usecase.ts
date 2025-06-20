import { inject, injectable } from "tsyringe";
import { IToggleCommentLikeUseCase } from "../../../entities/useCaseInterfaces/feed/comment/toggle-comment-like-usecase.interface";
import { ICommentRepository } from "../../../entities/repositoryInterfaces/feed/comment-repository.interface";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";

@injectable()
export class ToggleCommentLikeUseCase implements IToggleCommentLikeUseCase {
  constructor(
    @inject("ICommentRepository") private _commentRepository: ICommentRepository
  ) {}
  async execute({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<boolean> {
    let comment = await this._commentRepository.findOne({ commentId });
    if (!comment) {
      throw new CustomError(
        ERROR_MESSAGES.COMMENT_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    let liked = comment?.likes.includes(userId) || false;

    if (liked) {
      comment = await this._commentRepository.removeLike({ commentId, userId });
    } else {
      comment = await this._commentRepository.addLike({ commentId, userId });
    }

    return !liked;
  }
}
