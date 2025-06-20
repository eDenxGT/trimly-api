import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface IGetCommunityForEditUseCase {
  execute(communityId: string): Promise<ICommunityChatRoomEntity>;
}
