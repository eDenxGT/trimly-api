import { IPostEntity } from "../../../models/post.entity";

export interface IToggleLikePostUseCase {
  execute({
    postId,
    userId,
  }: {
    postId: string;
    userId: string;
  }): Promise<boolean | null>;
}
