import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface IGetAllCommunityChatsByUserUseCase {
  execute({ userId }: { userId: string }): Promise<Partial<ICommunityChatRoomEntity>[]>;
}
