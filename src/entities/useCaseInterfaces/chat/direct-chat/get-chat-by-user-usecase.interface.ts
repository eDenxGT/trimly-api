import { IChatRoomEntity } from "../../../models/chat/chat-room.entity";

export interface IGetChatByUserUseCase {
  execute(
    opponentUserId: string,
    currentUserId: string,
    currentUserRole: string
  ): Promise<IChatRoomEntity | null>; 
}
