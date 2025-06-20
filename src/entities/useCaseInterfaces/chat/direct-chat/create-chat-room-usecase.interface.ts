import { IChatRoomEntity } from "../../../models/chat/chat-room.entity";

export interface ICreateChatRoomUseCase {
  execute({
    clientId,
    barberId,
  }: {
    clientId: string;
    barberId: string;
  }): Promise<IChatRoomEntity>;
}
