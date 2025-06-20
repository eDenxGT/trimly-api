import { IChatRoomEntity } from "../../../models/chat/chat-room.entity";
import { ICommunityChatRoomEntity } from "../../../models/chat/community-chat-room.entity";
import { IBaseRepository } from "../../base-repository.interface";

export interface IChatRoomRepository extends IBaseRepository<IChatRoomEntity> {
  getChatRoomByChatId(
    chatId: string,
    role: "client" | "barber"
  ): Promise<IChatRoomEntity | null>;

  getChatRoomByUserId(
    opponentUserId: string,
    currentUserId: string,
    currentUserRole: "client" | "barber"
  ): Promise<IChatRoomEntity | null>;

  getAllChatsByUserId(
    userId: string,
    userRole: "client" | "barber"
  ): Promise<IChatRoomEntity[]>;

}
