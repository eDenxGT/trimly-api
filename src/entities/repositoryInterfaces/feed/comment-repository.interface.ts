import { IBaseRepository } from "../base-repository.interface";
import { ICommentEntity } from "../../models/comment.entity";

export interface ICommentRepository extends IBaseRepository<ICommentEntity> {
  addLike({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<ICommentEntity | null>;

  removeLike({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<ICommentEntity | null>;
}
