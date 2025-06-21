import {inject, injectable} from "tsyringe";
import {IAddPostUseCase} from "../../../entities/useCaseInterfaces/feed/post/add-post-usecase.interface";
import {generateUniqueId} from "../../../shared/utils/unique-uuid.helper";
import {IPostRepository} from "../../../entities/repositoryInterfaces/feed/post-repository.interface";
import {IBarberRepository} from "../../../entities/repositoryInterfaces/users/barber-repository.interface";
import {CustomError} from "../../../entities/utils/custom.error";
import {ERROR_MESSAGES, HTTP_STATUS} from "../../../shared/constants";

@injectable()
export class AddPostUseCase implements IAddPostUseCase {
   constructor(
      @inject("IPostRepository") private _postRepository: IPostRepository,
      @inject("IBarberRepository") private _barberRepository: IBarberRepository
   ) {
   }

   async execute(
      userId: string,
      caption: string,
      description: string,
      image: string
   ): Promise<void> {
      const barberActive = await this._barberRepository.findOne({status: "active", userId: userId})

      if (!barberActive) {
         throw new CustomError(ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION, HTTP_STATUS.NOT_FOUND)
      }

      await this._postRepository.save({
         postId: generateUniqueId("post"),
         barberId: userId,
         caption,
         description,
         image,
         status: "active",
      });
   }
}
