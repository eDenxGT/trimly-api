import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface IGetCommunityByCommunityIdUseCase {
  execute(communityId: string): Promise<ICommunityChatRoomEntity | null>;
}
