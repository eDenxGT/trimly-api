import {inject, injectable} from "tsyringe";
import {
   IBarberJoinCommunityUseCase
} from "../../../entities/useCaseInterfaces/chat/community/barber-join-community-usecase.interface";
import {
   ICommunityRepository
} from "../../../entities/repositoryInterfaces/chat/community/community-respository.interface";
import {CustomError} from "../../../entities/utils/custom.error";
import {ERROR_MESSAGES, HTTP_STATUS} from "../../../shared/constants";
import {IBarberRepository} from "../../../entities/repositoryInterfaces/users/barber-repository.interface";

@injectable()
export class BarberJoinCommunityUseCase implements IBarberJoinCommunityUseCase {
   constructor(
      @inject("ICommunityRepository")
      private _communityRepository: ICommunityRepository,
      @inject("IBarberRepository") private _barberRepository: IBarberRepository,
   ) {
   }

   async execute({
                    communityId,
                    userId,
                 }: {
      communityId: string;
      userId: string;
   }): Promise<void> {
      const community = await this._communityRepository.findOne({
         communityId,
         status: "active",
      });

      if (!community) {
         throw new CustomError(
            ERROR_MESSAGES.COMMUNITY_NOT_FOUND,
            HTTP_STATUS.NOT_FOUND
         );
      }

      const barberIsActive = await this._barberRepository.findOne({status: "active", userId});
      if (!barberIsActive) {
         throw new CustomError(ERROR_MESSAGES.ACCOUNT_UNDER_VERIFICATION, HTTP_STATUS.BAD_REQUEST);
      }

      if (community.members.includes(userId)) {
         throw new CustomError(
            ERROR_MESSAGES.ALREADY_JOINED_IN_COMMUNITY,
            HTTP_STATUS.BAD_REQUEST
         );
      }

      await this._communityRepository.update({communityId}, {
         $addToSet: {
            members: userId
         }
      });
   }
}
