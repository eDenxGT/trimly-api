import { IMeetingRoomEntity } from "../../../models/chat/meeting-room.entity";

export interface IGetMeetingByCommunityIdUseCase {
	execute(communityId: string): Promise<IMeetingRoomEntity>;
}
