import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface IEditCommunityUseCase {
  execute(data: Partial<ICommunityChatRoomEntity>): Promise<void>;
}
