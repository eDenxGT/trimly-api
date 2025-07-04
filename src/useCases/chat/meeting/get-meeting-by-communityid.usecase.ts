import { inject, injectable } from "tsyringe";
import { CustomError } from "../../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../../shared/constants";
import { IMeetingRoomRepository } from "../../../entities/repositoryInterfaces/chat/meeting-room-repository.interface";
import { IMeetingRoomEntity } from "../../../entities/models/chat/meeting-room.entity";
import { IGetMeetingByCommunityIdUseCase } from "../../../entities/useCaseInterfaces/chat/meeting/get-meeting-by-communityid-usecase.interface";

@injectable()
export class GetMeetingByCommunityIdUseCase
  implements IGetMeetingByCommunityIdUseCase
{
  constructor(
    @inject("IMeetingRoomRepository")
    private _meetingRoomRepository: IMeetingRoomRepository
  ) {}

  async execute(communityId: string): Promise<IMeetingRoomEntity> {
    const meetingRoom =
      await this._meetingRoomRepository.findLastPlannedMeeting(communityId);

    if (!meetingRoom) {
      throw new CustomError(
        ERROR_MESSAGES.MEETING_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }

    return meetingRoom;
  }
}
