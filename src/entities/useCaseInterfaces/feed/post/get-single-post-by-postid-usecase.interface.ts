import { IPostEntity } from "../../../models/post.entity";

export interface IGetSinglePostByPostIdUseCase {
  execute(
    userId: string,
    role: string,
    postId: string,
    forType: string
  ): Promise<IPostEntity | null>;
}
