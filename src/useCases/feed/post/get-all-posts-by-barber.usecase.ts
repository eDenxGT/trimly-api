import { inject, injectable } from "tsyringe";
import { IPostEntity } from "../../../entities/models/post.entity";
import { IGetAllPostsByBarberUseCase } from "../../../entities/useCaseInterfaces/feed/post/get-all-posts-by-barber-usecase.interface";
import { IPostRepository } from "../../../entities/repositoryInterfaces/feed/post-repository.interface";

@injectable()
export class GetAllPostsByBarberUseCase implements IGetAllPostsByBarberUseCase {
  constructor(
    @inject("IPostRepository") private _postRepository: IPostRepository
  ) {}
  async execute(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ items: IPostEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    return await this._postRepository.findAllPosts(
      {
        barberId: userId,
      },
      skip,
      limit,
      userId
    );
  }
}