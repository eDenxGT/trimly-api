import { IDirectMessageEntity } from "../../../models/chat/direct-message.entity";
import { IBaseRepository } from "../../base-repository.interface";

export interface IDirectMessageRepository
  extends IBaseRepository<IDirectMessageEntity> {
  markMessagesAsRead({
    chatRoomId,
    userId,
  }: {
    chatRoomId: string;
    userId: string;
  }): Promise<void>;
}
