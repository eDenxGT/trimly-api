import { injectable } from "tsyringe";
import { ICommentRepository } from "../../../entities/repositoryInterfaces/feed/comment-repository.interface";
import {
  CommentModel,
  ICommentModel,
} from "../../../frameworks/database/mongoDb/models/comment.model";
import { BaseRepository } from "../base.repository";
import { ICommentEntity } from "../../../entities/models/comment.entity";

@injectable()
export class CommentRepository
  extends BaseRepository<ICommentModel>
  implements ICommentRepository
{
  constructor() {
    super(CommentModel);
  }
  async addLike({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<ICommentEntity | null> {
    return await CommentModel.findOneAndUpdate(
      { commentId },
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }

  async removeLike({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<ICommentEntity | null> {
    return await CommentModel.findOneAndUpdate(
      { commentId },
      { $pull: { likes: userId } },
      { new: true }
    );
  }
}
