import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface ICreateCommunityUseCase {
  execute(data: Partial<ICommunityChatRoomEntity>): Promise<void>;
}
