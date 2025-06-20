import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";

export interface IGetCommunityChatUseCase {
  execute({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }): Promise<ICommunityChatRoomEntity | null>;
}
