import { IChatRoomEntity } from "../../../models/chat/chat-room.entity";

export interface IGetAllChatsByUserUseCase {
  execute(
    userId: string,
    role: "client" | "barber"
  ): Promise<IChatRoomEntity[]>;
}
